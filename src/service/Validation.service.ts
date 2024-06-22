import api from "../api";
import { ParsedCSVStruct } from "../interface";

class ValidationService {
  static validateDataForPriceAdjustment = async (data: ParsedCSVStruct) => {
    try {
      const response = await api.post("/validate", data);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  };
}

export default ValidationService;
