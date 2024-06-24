import Papa from "papaparse";
import { BatchReadjustmentStruct } from "../interface";

export default async function parseCSV(csvFile: File): Promise<BatchReadjustmentStruct> {
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
          const { fields } = results.meta;
          const data = results.data as Record<string, string>[];
          resolve({ fields, data });
        },
      });
    } catch (e: any) {
      reject(e);
    }
  });
}
