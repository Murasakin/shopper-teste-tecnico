export interface ParsedCSVStruct {
  columns: string[];
  data: { [key: string]: string }[];
}
