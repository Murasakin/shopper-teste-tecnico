import api from "../api";

class UpdateService {
  static updatePrices = async (updateId: string): Promise<void> => {
    try {
      await api.post(
        "/updateprices",
        { updateId },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
    } catch (error: any) {
      throw error;
    }
  };
}

export default UpdateService;
