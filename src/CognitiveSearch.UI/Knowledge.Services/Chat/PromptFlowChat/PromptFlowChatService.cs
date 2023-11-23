// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

namespace Knowledge.Services.Chat.PromptFlow
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Net.Http;
    using System.Net.Http.Headers;
    using System.Text.Json;
    using System.Threading.Tasks;
    using Azure.Core;
    using Knowledge.Configuration.Chat;
    using Knowledge.Models.Chat;
    using Knowledge.Services.Chat.PromptFlowChat;
    using Knowledge.Services.Helpers;
    using Microsoft.ApplicationInsights;
    using Microsoft.Extensions.Caching.Distributed;

    public class PromptFlowChatService : AbstractService, IPromptFlowChatService
    {
        private PromptFlowConfig _config { get; set; }
        private IChatHistoryService _chatHistoryService { get; set; }

        public PromptFlowChatService(PromptFlowConfig config, IChatHistoryService chatHistoryService, IDistributedCache cache, TelemetryClient telemetry)
        {
            distCache = cache;
            _config = config;
            CachePrefix = this.GetType().Name;
            _chatHistoryService = chatHistoryService;
        }


        public async Task<List<LLMDataSource>> GetAvailableLLMDataSources()
        {
            return _config.LLMDataSources;
        }

        public async Task<List<LLMModel>> GetAvailableLLMModels()
        {
            return _config.LLMModels;
        }

        public async Task<string> Completion(ChatRequest request)
        {
            throw new NotImplementedException();
        }

        public async Task<ChatResponse> ChatCompletion(ChatRequest request, string userId, string sessionId)
        {
            LoggerHelper.Instance.LogVerbose($"Start:Invoked ChatCompletion method in PromptFlowChatService");

            await _chatHistoryService.AddChatMessageToHistory(userId, sessionId, "user", request.prompt, DateTime.UtcNow);

            try
            {
                var pfRequest = PromptFlowMapper.MapChatRequestToPFChatRequest(request);
                var answer = await InvokeRequestResponseService(pfRequest);
                var response = PromptFlowMapper.MapPFChatResponseToChatResponse(answer);
                await _chatHistoryService.AddChatMessageToHistory(userId, sessionId, "agent", response.answer, DateTime.UtcNow);
                return response;
            }
            catch (Exception ex)
            {
                LoggerHelper.Instance.LogError(ex, ex.Message, "API", "PromptFlowChatService.ChatCompletion");
            }

            LoggerHelper.Instance.LogVerbose($"End:Invoked ChatCompletion method in PromptFlowChatService. Return empty result");

            return new ChatResponse();
        }        

        async Task<PromptFlowResponse> InvokeRequestResponseService(PromptFlowChatRequest request)
        {
            var handler = new HttpClientHandler()
            {
                ClientCertificateOptions = ClientCertificateOption.Manual,
                ServerCertificateCustomValidationCallback =
                        (httpRequestMessage, cert, cetChain, policyErrors) => { return true; }
            };
            using (var client = new HttpClient(handler))
            {
                var requestBody = JsonSerializer.Serialize(request);

                if (string.IsNullOrEmpty(_config.ApiKey))
                {
                    throw new Exception("A key should be provided to invoke the endpoint");
                }

                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _config.ApiKey);
                client.BaseAddress = new Uri(_config.MLEndpoint);

                var content = new StringContent(requestBody);
                content.Headers.ContentType = new MediaTypeHeaderValue("application/json");

                //content.Headers.Add("azureml-model-deployment", "unilever-pf-chat-5");

                HttpResponseMessage response = await client.PostAsync("", content);

                if (response.IsSuccessStatusCode)
                {
                    string responseContent = await response.Content.ReadAsStringAsync();
                    var pfResponse = JsonSerializer.Deserialize<PromptFlowResponse>(responseContent);
                    return pfResponse;
                }
                else
                {
                    Console.WriteLine(string.Format("The request failed with status code: {0}", response.StatusCode));
                    Console.WriteLine(response.Headers.ToString());
                    string responseContent = await response.Content.ReadAsStringAsync();
                    Console.WriteLine(responseContent);
                    return new PromptFlowResponse
                    {
                        answer = responseContent
                    };
                }
            }
        }

        
    }
}
