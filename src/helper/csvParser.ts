import Papa from "papaparse";
import { ParsedCSVStruct } from "../interface";

export default async function csvParser(csvFile: File): Promise<ParsedCSVStruct> {
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
          // if (results.meta.fields.length !== 2) {
          //   reject(
          //     "O arquivo CSV deve conter duas colunas, sendo a primeira com os códigos dos produtos, e a segunda com o novo preço!"
          //   );
          //   return;
          // }
          const columns = results.meta.fields;
          const data = results.data as Record<string, string>[];
          // const data = rawData.map((value) => ({
          //   [columns[0]]: Number(value[columns[0]]),
          //   [columns[1]]: Number(value[columns[1]]),
          // }));
          resolve({ columns, data });
        },
      });
    } catch (e: any) {
      reject(e);
    }
  });
}
