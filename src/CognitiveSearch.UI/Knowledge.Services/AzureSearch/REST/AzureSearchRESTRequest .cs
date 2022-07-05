﻿// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

namespace Knowledge.Services.AzureSearch
{
    using Newtonsoft.Json;
    using System.Collections.Generic;

    public class AzureSearchRESTRequest
    {
        public string queryType { get; set; }

        //
        // Summary:
        //     Initializes a new instance of the AzureSearchServiceRequest class.
        //
        // Parameters:
        //   includeTotalResultCount:
        //     A value that specifies whether to fetch the total count of results. Default is
        //     false. Setting this value to true may have a performance impact. Note that the
        //     count returned is an approximation.
        //
        //   facets:
        //     The list of facet expressions to apply to the search query. Each facet expression
        //     contains a field name, optionally followed by a comma-separated list of name:value
        //     pairs.
        //
        //   filter:
        //     The OData $filter expression to apply to the search query.
        //
        //   highlightFields:
        //     The list of field names to use for hit highlights. Only searchable fields can
        //     be used for hit highlighting.
        //
        //   highlightPostTag:
        //     A string tag that is appended to hit highlights. Must be set with highlightPreTag.
        //     Default is &lt;/em&gt;.
        //
        //   highlightPreTag:
        //     A string tag that is prepended to hit highlights. Must be set with highlightPostTag.
        //     Default is &lt;em&gt;.
        //
        //   minimumCoverage:
        //     A number between 0 and 100 indicating the percentage of the index that must be
        //     covered by a search query in order for the query to be reported as a success.
        //     This parameter can be useful for ensuring search availability even for services
        //     with only one replica. The default is 100.
        //
        //   orderBy:
        //     The list of OData $orderby expressions by which to sort the results. Each expression
        //     can be either a field name or a call to either the geo.distance() or the search.score()
        //     functions. Each expression can be followed by asc to indicate ascending, and
        //     desc to indicate descending. The default is ascending order. Ties will be broken
        //     by the match scores of documents. If no OrderBy is specified, the default sort
        //     order is descending by document match score. There can be at most 32 $orderby
        //     clauses.
        //
        //   queryType:
        //     A value that specifies the syntax of the search query. The default is 'simple'.
        //     Use 'full' if your query uses the Lucene query syntax. Possible values include:
        //     'simple', 'full'
        //
        //   scoringParameters:
        //     The list of parameter values to be used in scoring functions (for example, referencePointParameter)
        //     using the format name-values. For example, if the scoring profile defines a function
        //     with a parameter called 'mylocation' the parameter string would be "mylocation--122.2,44.8"
        //     (without the quotes).
        //
        //   scoringProfile:
        //     The name of a scoring profile to evaluate match scores for matching documents
        //     in order to sort the results.
        //
        //   searchFields:
        //     The list of field names to which to scope the full-text search. When using fielded
        //     search (fieldName:searchExpression) in a full Lucene query, the field names of
        //     each fielded search expression take precedence over any field names listed in
        //     this parameter.
        //
        //   searchMode:
        //     A value that specifies whether any or all of the search terms must be matched
        //     in order to count the document as a match. Possible values include: 'any', 'all'
        //
        //   select:
        //     The list of fields to retrieve. If unspecified, all fields marked as retrievable
        //     in the schema are included.
        //
        //   skip:
        //     The number of search results to skip. This value cannot be greater than 100,000.
        //     If you need to scan documents in sequence, but cannot use $skip due to this limitation,
        //     consider using $orderby on a totally-ordered key and $filter with a range query
        //     instead.
        //
        //   top:
        //     The number of search results to retrieve. This can be used in conjunction with
        //     $skip to implement client-side paging of search results. If results are truncated
        //     due to server-side paging, the response will include a continuation token that
        //     can be used to issue another Search request for the next page of results.

        //
        // Summary:
        //     Gets or sets the list of fields to retrieve. If unspecified, all fields marked
        //     as retrievable in the schema are included.

        [JsonProperty("select", NullValueHandling = NullValueHandling.Ignore)]
        public string select { get; set; }

        //
        // Summary:
        //     Gets or sets a value that specifies whether any or all of the search terms must
        //     be matched in order to count the document as a match. Possible values include:
        //     'any', 'all'
        [JsonProperty("searchMode", NullValueHandling = NullValueHandling.Ignore)]
        public string searchMode { get; set; }

        //
        // Summary:
        //     Query Text 
        [JsonProperty("search", NullValueHandling = NullValueHandling.Ignore)]
        public string search { get; set; }

        //
        // Summary:
        //     Gets or sets the list of field names to which to scope the full-text search.
        //     When using fielded search (fieldName:searchExpression) in a full Lucene query,
        //     the field names of each fielded search expression take precedence over any field
        //     names listed in this parameter.
        [JsonProperty("searchFields", NullValueHandling = NullValueHandling.Ignore)]
        public string searchFields { get; set; }

        //
        // Summary:
        //     Gets or sets the name of a scoring profile to evaluate match scores for matching
        //     documents in order to sort the results.
        [JsonProperty("scoringProfile", NullValueHandling = NullValueHandling.Ignore)]
        public string scoringProfile { get; set; }


        // Introduced in 2021-04-30-Preview 
        [JsonProperty("semanticConfiguration", NullValueHandling = NullValueHandling.Ignore)]
        public string semanticConfiguration { get; set; }

        //
        // Summary:
        //     Gets or sets the list of parameter values to be used in scoring functions (for
        //     example, referencePointParameter) using the format name-values. For example,
        //     if the scoring profile defines a function with a parameter called 'mylocation'
        //     the parameter string would be "mylocation--122.2,44.8" (without the quotes).
        //public IList<ScoringParameter> ScoringParameters { get; set; }
        //
        // Summary:
        //     Gets or sets a value that specifies the syntax of the search query. The default
        //     is 'simple'. Use 'full' if your query uses the Lucene query syntax. Possible
        //     values include: 'simple', 'full'
        //public QueryType QueryType { get; set; }
        //
        // Summary:
        //     Gets or sets the list of OData $orderby expressions by which to sort the results.
        //     Each expression can be either a field name or a call to either the geo.distance()
        //     or the search.score() functions. Each expression can be followed by asc to indicate
        //     ascending, and desc to indicate descending. The default is ascending order. Ties
        //     will be broken by the match scores of documents. If no OrderBy is specified,
        //     the default sort order is descending by document match score. There can be at
        //     most 32 $orderby clauses.
        [JsonProperty("orderBy", NullValueHandling = NullValueHandling.Ignore)]
        public IList<string> orderBy { get; set; }

        //
        // Summary:
        //     Gets or sets a number between 0 and 100 indicating the percentage of the index
        //     that must be covered by a search query in order for the query to be reported
        //     as a success. This parameter can be useful for ensuring search availability even
        //     for services with only one replica. The default is 100.
        [JsonProperty("minimumCoverage", NullValueHandling = NullValueHandling.Ignore)]
        public int? minimumCoverage { get; set; }

        //
        // Summary:
        //     Gets or sets a string tag that is prepended to hit highlights. Must be set with
        //     highlightPostTag. Default is &amp;lt;em&amp;gt;.
        [JsonProperty("highlightPreTag", NullValueHandling = NullValueHandling.Ignore)]
        public string highlightPreTag { get; set; }

        //
        // Summary:
        //     Gets or sets a string tag that is appended to hit highlights. Must be set with
        //     highlightPreTag. Default is &amp;lt;/em&amp;gt;.
        [JsonProperty("highlightPostTag", NullValueHandling = NullValueHandling.Ignore)]
        public string highlightPostTag { get; set; }

        //
        // Summary:
        //     Gets or sets the list of field names to use for hit highlights. Only searchable
        //     fields can be used for hit highlighting.
        [JsonProperty("highlight", NullValueHandling = NullValueHandling.Ignore)]
        public string highlight { get; set; }

        //
        // Summary:
        //     Gets or sets the OData $filter expression to apply to the search query.
        [JsonProperty("filter", NullValueHandling = NullValueHandling.Ignore)]
        public string filter { get; set; }

        //
        // Summary:
        //     Gets or sets the list of facet expressions to apply to the search query. Each
        //     facet expression contains a field name, optionally followed by a comma-separated
        //     list of name:value pairs.
        [JsonProperty("facets", NullValueHandling = NullValueHandling.Ignore)]
        public IList<string> facets { get; set; }

        //
        // Summary:
        //     Gets or sets a value that specifies whether to fetch the total count of results.
        //     Default is false. Setting this value to true may have a performance impact. Note
        //     that the count returned is an approximation.
        [JsonProperty("count", NullValueHandling = NullValueHandling.Ignore)]
        public bool count { get; set; }

        //
        // Summary:
        //     Gets or sets the number of search results to skip. This value cannot be greater
        //     than 100,000. If you need to scan documents in sequence, but cannot use $skip
        //     due to this limitation, consider using $orderby on a totally-ordered key and
        //     $filter with a range query instead.
        [JsonProperty("skip", NullValueHandling = NullValueHandling.Ignore)]
        public int? skip { get; set; }

        //
        // Summary:
        //     Gets or sets the number of search results to retrieve. This can be used in conjunction
        //     with $skip to implement client-side paging of search results. If results are
        //     truncated due to server-side paging, the response will include a continuation
        //     token that can be used to issue another Search request for the next page of results.
        [JsonProperty("top", NullValueHandling = NullValueHandling.Ignore)]
        public int? top { get; set; }

        //
        // NEW - Query Language
        //     
        [JsonProperty("queryLanguage", NullValueHandling = NullValueHandling.Ignore)]
        public string queryLanguage { get; set; }

        //
        // NEW - Speller => lexicon
        //     
        [JsonProperty("speller", NullValueHandling = NullValueHandling.Ignore)]
        public string speller { get; set; }

        //
        // NEW - SEMANTIC SEARCH Support 
        //     
        [JsonProperty("answers", NullValueHandling = NullValueHandling.Ignore)]
        public string answers { get; set; }

    }
}

