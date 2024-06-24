import api from "../api";

class ValidationService {
  static validateCsvFileData = async (file: File) => {
    try {
      const response = await api.post("/validateBatchReadjustments", file, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error: any) {
      throw error;
    }
  };
}

export default ValidationService;
