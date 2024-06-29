export interface ValidateCSVDataCommand {
  columns: string[];
  data: Record<string, string>[];
}
