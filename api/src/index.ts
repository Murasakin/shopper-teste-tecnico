import PriceReadjustmentController from "./controllers/PriceReadjustments.controller";
import SQLProductsRepository from "./repository/implementation/SQLProductsRepository";
import ValidateCsvData from "./use-cases/ValidateCSVData";

const priceReadjustmentController = new PriceReadjustmentController(new ValidateCsvData(new SQLProductsRepository()));

export { priceReadjustmentController };
