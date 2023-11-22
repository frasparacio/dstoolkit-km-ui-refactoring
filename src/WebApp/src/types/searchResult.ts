interface SearchResult {
  results: {
    Document: {
      "content_group": string;
      "title": string;
      "translated_title": string;
      "summary": string[];
      "key_phrases": string[];
      "source_last_modified": string;
      "source_processing_date": string;
      "document_url": string;
      "authors": string[];
    };
  }[];
  count: number;
}