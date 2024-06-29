import api from "../api";
import { ParsedCSVStruct, ValidationResultStruct } from "../interface";

class ValidationService {
  static validateCsvFileData = async (csv: ParsedCSVStruct): Promise<ValidationResultStruct> => {
    try {
      const response = await api.post("/validatecsvdata", csv, {
        headers: { "Content-Type": "application/json" },
      });
      return response.data;
    } catch (error: any) {
      throw error;
    }
  };
}

export default ValidationService;
