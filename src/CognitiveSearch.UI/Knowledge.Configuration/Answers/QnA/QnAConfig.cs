﻿// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

namespace Knowledge.Configuration.Answers.QnA
{
    public class QnAConfig : AbstractServiceConfig
    {
        public string QNAServiceEndpoint { get; set; }

        public string KnowledgeDatabaseId { get; set; }

        public string QNAserviceKey { get; set; }

        public int CacheExpirationTime { get; set; }

        public int QNAScoreThreshold { get; set; }

    }
}
