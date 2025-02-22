# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License.

import logging

from requests.models import HTTPError
import azure.functions as func
import json
import requests, uuid
import os
import time
import math

endpoint = os.environ["TEXT_TRANSLATION_ENDPOINT"]
subscription_key = os.environ["COGNITIVE_SERVICES_KEY"]
location = os.environ["TEXT_TRANSLATION_LOCATION"]
version = os.environ["TEXT_TRANSLATION_VERSION"]
# retry = int(os.environ["TEXT_TRANSLATION_RETRY"])

DEFAULT_RETRY_SECONDS = 2.0

#https://docs.microsoft.com/en-us/azure/cognitive-services/translator/request-limits
MAX_CHARS_PER_DOC=int(os.environ["TEXT_TRANSLATION_MAX_CHARS_PER_DOC"])
MAX_DOC_PER_REQUEST=int(os.environ["TEXT_TRANSLATION_MAX_DOC_PER_REQUEST"])

path = '/translate'
constructed_url = endpoint + path
available_language = ["af", "sq", "am", "ar", "hy", "as", "az", "bn", "ba", "bs", "bg","yue", "ca",
"zh", "zh_chs", "zh_cht", "lzh", "zh-Hans", "zh-Hant", 
"hr", "cs", "da", "prs", "dv", "nl", "en","et", "fj", "fil", "fi",
"fr", "fr-ca", "ka", "de", "el", "gu", "ht", "he", "hi", "mww",
"hu", "is", "id", "iu", "ga", "it", "ja", "kn", "kk", "km", "tlh-Latn", "tlh-Piqd", "ko",
"ku", "kmr", "ky", "lo", "lv", "lt", "mk", "mg", "ms", "ml", "mt", "mi", "mr", "mn-Cyrl",
"mn-Mong", "my", "ne", "nb", "or", "ps", "fa", "pl", "pt", "pt-pt", "pa", "otq", "ro", "ru",
"sm", "sr-Cyrl", "sr-Latn", "sk", "sl", "es", "sw", "sv", "ty", "ta", "tt", "te", "th", "bo",
"ti", "to", "tr", "tk", "uk", "ur", "ug", "uz", "vi", "cy", "yua"]

def main(req: func.HttpRequest, context: func.Context) -> func.HttpResponse:
    logging.info(f'{context.function_name} HTTP trigger function processed a request.')
    if hasattr(context, 'retry_context'):
        logging.info(f'Current retry count: {context.retry_context.retry_count}')
        
        if context.retry_context.retry_count == context.retry_context.max_retry_count:
            logging.info(
                f"Max retries of {context.retry_context.max_retry_count} for "
                f"function {context.function_name} has been reached")

    try:
        body = json.dumps(req.get_json())
    except ValueError:
        return func.HttpResponse(
             "Invalid body",
             status_code=400
        )
    
    if body:
        result = compose_response(req.headers, body)
        return func.HttpResponse(result, mimetype="application/json")
    else:
        return func.HttpResponse(
             "Invalid body",
             status_code=400
        )

def compose_response(headers, json_data):
    values = json.loads(json_data)['values']
    
    # Prepare the Output before the loop
    results = {}
    results["values"] = []

    for value in values:
        output_record = transform_value(headers, value)
        if output_record != None:
            results["values"].append(output_record)

    return json.dumps(results, ensure_ascii=False)        

## Perform an operation on a record
def transform_value(headers, record):
    try:
        recordId = record['recordId']
    except AssertionError  as error:
        return None

    # Validate the inputs
    try:
        document = {}
        document['recordId'] = recordId
        document['data'] = {}
        document['warnings'] = []

        assert ('data' in record), "'data' field is required."
        data = record['data']

        fromLanguageCode = 'en'
        if "fromLanguageCode" in data and data["fromLanguageCode"] in available_language:
            fromLanguageCode = data["fromLanguageCode"]
        elif "defaultFromLanguageCode" in headers and headers["defaultFromLanguageCode"] in available_language:
            fromLanguageCode = headers["defaultFromLanguageCode"]
        elif "suggestedFrom" in headers and headers["suggestedFrom"] in available_language:
            fromLanguageCode = headers["suggestedFrom"]

        toLanguageCode = headers["defaultToLanguageCode"]
        if "toLanguageCode" in data:
            toLanguageCode = data["toLanguageCode"]

        #
        # Chinese language code normalization
        # https://learn.microsoft.com/en-us/azure/cognitive-services/language-service/language-detection/language-support
        # vs
        # https://learn.microsoft.com/en-us/azure/cognitive-services/translator/language-support
        #
        if fromLanguageCode == 'zh':
            fromLanguageCode = 'lzh'
        if fromLanguageCode == 'zh_chs':
            fromLanguageCode = 'zh-Hans'
        if fromLanguageCode == 'zh_cht':
            fromLanguageCode = 'zh-Hant'

        # If the document was translated already, we
        # enable language detection for metadata translation like Title which
        # currently not handled by Document Translation.
        if 'translated_document' in data and data['translated_document']:
            fromLanguageCode=None
        else:
            document['data']['translatedFromLanguageCode'] = fromLanguageCode
            
        document['data']['translatedToLanguageCode'] = toLanguageCode

        if "text" in data:
            if fromLanguageCode != toLanguageCode:
                params = {
                    'api-version': version,
                    'to': toLanguageCode
                }
                if fromLanguageCode: # if non automatic language detection
                    params['from'] = fromLanguageCode

                headers_translator = {
                    'Ocp-Apim-Subscription-Key': subscription_key,
                    'Ocp-Apim-Subscription-Region': location,
                    'Content-type': 'application/json',
                    'X-ClientTraceId': str(uuid.uuid4())
                }

                logging.info(f'Translation url {constructed_url}')
                logging.info(f'Translation params {params}')
                logging.info(f'Translation headers {headers_translator}')

                # https://docs.microsoft.com/en-us/azure/cognitive-services/translator/request-limits
                text = data['text']
                chunks = [text[i:i+MAX_CHARS_PER_DOC] for i in range(0, len(text), MAX_CHARS_PER_DOC)]

                # If the number of chunks is greater than the maximum allowed, then ignore the rest of it.
                if len(chunks) > MAX_DOC_PER_REQUEST:
                    chunks=chunks[:MAX_DOC_PER_REQUEST]

                response_text = ''
                for chunk in chunks:
                    body = [{'text': chunk}]
                    response = requests.post(constructed_url, params=params, headers=headers_translator, json=body)
                    response_content = response.json()
                    if response.status_code == 200:
                        response_text += response_content[0]['translations'][0]['text']
                    elif response.status_code == 429 or response.status_code == 429001:
                        # Too Many Requests - Rate limiting
                        logging.warn(f'Too Many Requests - one retry')
                        document['warnings'].append({"message": "429 - Too Many Requests"})
                        # Wait a bit and retry
                        if ('retry-after-ms' in response.headers):
                            # request.headers.headers. retry-after-ms
                            time.sleep(max(DEFAULT_RETRY_SECONDS,float(response.headers['retry-after-ms'])/1000))
                        else:
                            time.sleep(DEFAULT_RETRY_SECONDS)
                        response = requests.post(constructed_url, params=params, headers=headers_translator, json=body)
                        response_content = response.json()
                        if response.status_code == 200:
                            response_text += response_content[0]['translations'][0]['text']
                        else:
                            document['warnings'].append({"message": response.text})
                    else:
                        document['warnings'].append({"message": f'Error {response.status_code} - {response.text}'})

                document['data']['translatedText'] = response_text
            else:
                document['data']['translatedText'] = data['text']
        else:
            document['data']['translatedText'] = ''
            document['warnings'] = [{"message": "No text to translate"}]

    except KeyError as error:
        return (
            {
            "recordId": recordId,
            "errors": [ { "message": "KeyError:" + error.args[0] }   ]       
            })
    except AssertionError as error:
        return (
            {
            "recordId": recordId,
            "errors": [ { "message": "AssertionError:" + error.args[0] }   ]       
            })
    except SystemError as error:
        return (
            {
            "recordId": recordId,
            "errors": [ { "message": "SystemError:" + error.args[0] }   ]       
            })
    except AttributeError as error:
        return (
            {
            "recordId": recordId,
            "errors": [ { "message": "AttributeError:" + error.args[0] }   ]       
            })

    return (document)
