import Papa from "papaparse";
import { ParsedCSVStruct } from "../interface";

export default async function parseCSV(csvFile: File): Promise<ParsedCSVStruct> {
  return new Promise((resolve, reject) => {
    try {
      Papa.parse(csvFile, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (!results.meta.fields) {
            reject("O arquivo CSV não pode estar vazio e a primeira linha deve ser um cabeçalho!");
            return;
          }
          const data = results.data as Record<string, string>[];
          resolve({ columns: results.meta.fields, data });
        },
      });
    } catch (e: any) {
      reject(e);
    }
  });
}
