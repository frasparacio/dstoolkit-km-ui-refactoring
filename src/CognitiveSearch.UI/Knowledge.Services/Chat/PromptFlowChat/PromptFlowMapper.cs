using Knowledge.Models.Chat;
using System.Collections.Generic;
using System.Linq;

namespace Knowledge.Services.Chat.PromptFlowChat
{
    public static class PromptFlowMapper
    {
        #region Request

        public static PromptFlowChatRequest MapChatRequestToPFChatRequest(ChatRequest request)
        {
            return new PromptFlowChatRequest
            {
                question = request.prompt,
                source = request.options.source,
                model = request.options.model,
                chat_history = MapChatHistoryToPromptFlowFormat(request.history)
            };
        }

        #endregion

        #region ChatHistory
        private static PFChatHistoryTurn[] MapChatHistoryToPromptFlowFormat(ChatMessage[] history)
        {
            var pfHistory = new List<PFChatHistoryTurn>();

            for (var i = 0; i < history.Length; i++)
            {
                if (history[i].role == "user")
                {
                    var turn = new PFChatHistoryTurn()
                    {
                        inputs = new PromptFlowChatBaseRequest
                        {
                            question = history[i].content
                        },
                        outputs = new PromptFlowChatResponse
                        {
                            answer = history[i + 1].content
                        }
                    };

                    pfHistory.Add(turn);
                }
                continue;
            }

            return pfHistory.ToArray();
        }

        #endregion

        #region Response

        public static ChatResponse MapPFChatResponseToChatResponse(PromptFlowResponse response)
        {
            var answerSplit = response.answer.Split("#section#");

            var chatResponse = new ChatResponse()
            {
                answer = answerSplit[0].Replace("Answer:", ""),
                followUpQs = answerSplit.Length > 1 ? GetFollowUpQs(answerSplit[1]) : new List<string>(),
                references = answerSplit.Length > 2 ? GetChatReferences(answerSplit[2]) : new List<ChatReference>()
            };

            return chatResponse;
        }

        /// #section@folloupqs: 1. What is the difference between a 3PL and a 4PL? | 2. What is the difference between a 3PL and a 4PL? | 3. What is the difference between a 3PL and a 4PL?
        private static IEnumerable<string> GetFollowUpQs(string followupqs)
        {
            try
            {
                var questions = followupqs.Substring(followupqs.IndexOf(":") + 1).Trim().Replace("\n", "").Trim()
                    .Split("|").Select(x => x.Replace("- ", "").Replace("1.", "").Replace("2.", "").Replace("3.", "").Trim());

                return questions;
            }
            catch
            {
                return Enumerable.Empty<string>();
            }
        }

        private static IEnumerable<ChatReference> GetChatReferences(string references)
        {
            try
            {
                return references.Substring(references.IndexOf(":") + 1).Trim().Replace("\n", "").Trim()
                    .Split("|").Select(x => GetChatReference(x.Trim()));
            }
            catch
            {
                return Enumerable.Empty<ChatReference>();
            }
        }

        private static ChatReference GetChatReference(string reference)
        {
            return new ChatReference
            {
                name = $"Ref - {reference}",
                chunkId = reference,
                parentId = reference,
                url = $"/documents/{reference}",
                isAbsoluteUrl = false
            };
        }

        #endregion endregion

        
    }
}
