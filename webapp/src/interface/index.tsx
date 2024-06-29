export interface ParsedCSVStruct {
  columns: string[];
  data: Record<string, string>[];
}

export interface ValidationResultStruct {
  updateId?: string;
  results: Array<{
    code: string;
    productName: string;
    currentPrice: string;
    readjustedPrice: string;
    error?: string;
  }>;
}
