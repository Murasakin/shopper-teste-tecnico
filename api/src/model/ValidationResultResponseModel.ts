import ValidationResultModel from "./ValidationResultModel";

export default interface ValidationResultResponseModel {
  updateId: string | undefined;
  results: ValidationResultModel[];
}
