# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License.

import logging
import azure.functions as func
import os
from azure.core.credentials import AzureKeyCredential
from azure.ai.translation.document import DocumentTranslationClient

endpoint = os.environ["COGNITIVE_SERVICES_ENDPOINT"]
subscription_key = os.environ["COGNITIVE_SERVICES_ENDPOINT"]

def main(req: func.HttpRequest, context: func.Context) -> func.HttpResponse:
    logging.info(f'{context.function_name} Document Translation Ops list ')

    logging.info(f'{context.function_name} Acquiring credentials ')
    credential = AzureKeyCredential(subscription_key)

    logging.info(f'{context.function_name} Acquiring DT client with endpoint {endpoint}')

    document_translation_client = DocumentTranslationClient(endpoint, credential)

    response = []
    
    if document_translation_client:
        operations = document_translation_client.list_translation_statuses()  
        # type: ItemPaged[TranslationStatus]

        for operation in operations:
            response.append(f"\nID: {operation.id}")
            response.append(f"Status: {operation.status}")
            response.append(f"Created on: {operation.created_on}")
            response.append(f"Last updated on: {operation.last_updated_on}")
            response.append(f"Total number of translations on documents: {operation.documents_total_count}")
            response.append(f"Total number of characters charged: {operation.total_characters_charged}")

            response.append("Of total documents...")
            response.append(f"{operation.documents_failed_count} failed")
            response.append(f"{operation.documents_succeeded_count} succeeded")
            response.append(f"{operation.documents_canceled_count} canceled")

        response.append(f"Document Translation Ops status completed !")

    return func.HttpResponse((os.linesep).join(response))
