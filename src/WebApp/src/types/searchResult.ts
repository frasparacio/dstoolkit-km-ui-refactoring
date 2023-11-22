interface SemanticSearch {
    RerankerScore: number | null;
    Captions: string[] | null;
  }
  
  interface Document {
    index_key: string;
    metadata_storage_path: string;
    metadata_storage_name: string;
    metadata_storage_size: number;
    metadata_storage_content_md5: string;
    content_source: string;
    content_size: number;
    source_processing_date: string | null;
    key_phrases: string[] | null;
    organizations: string[] | null;
    summary: string[] | null;
    title: string;
    authors: string[] | null;
    content_type: string;
    content_group: string;
    emails: string[] | null;
    document_url: string;
    // Add other properties as needed
  }
  
  interface Facet {
    value: string;
    count: number;
    query: any[] | null; // Add the appropriate type for the 'query' property
    singlevalued: boolean;
  }
  
  interface SearchResult {
    documents: Document[] | null;
    count: number;
    facets: {
      organizations?: Facet[] | null;
      locations?: Facet[] | null;
      key_phrases?: Facet[] | null;
      authors?: Facet[] | null;
      // Add other facets as needed
    };
  }
  
  interface Tokens {
    [key: string]: string;
  }
  
  interface FacetValue {
    value: string;
    count: number;
    query: any[] | null; // Add the appropriate type for the 'query' property
    singlevalued: boolean;
  }
  
  interface FacetCategory {
    [key: string]: FacetValue[] | null;
  }
  
  interface SearchResultsResponse {
    indexName: string;
    result: any | null;
    results: SearchResult[] | null;
    count: number;
    tokens: Tokens | null;
    storageIndex: number;
    facets: {
      organizations: FacetCategory | null;
      locations: FacetCategory | null;
      key_phrases: FacetCategory | null;
      authors: FacetCategory | null;
      // Add other facets as needed
    };
    searchId: string | null;
    idField: string;
    isSemanticSearch: boolean;
    isPathBase64Encoded: boolean;
    qnaAnswers: any | null;
    semanticAnswers: SemanticSearch | null;
    webSearchResults: any | null;
    queryTransformations: {
      [key: string]: string;
    } | null;
  }