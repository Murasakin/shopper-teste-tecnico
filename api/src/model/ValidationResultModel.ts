export default interface ValidationResultModel {
  code: string;
  productName: string;
  currentPrice: string;
  readjustedPrice: string;
  error?: string;
}
