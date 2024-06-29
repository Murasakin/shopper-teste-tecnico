import PriceReadjustmentController from "./controllers/PriceReadjustments.controller";
import SQLProductsRepository from "./repository/implementation/SQLProductsRepository";
import UpdatePrices from "./use-cases/UpdatePrices";
import ValidateCsvData from "./use-cases/ValidateCSVData";

const productsRepository = new SQLProductsRepository();

const priceReadjustmentController = new PriceReadjustmentController(
  new ValidateCsvData(productsRepository),
  new UpdatePrices(productsRepository)
);

export { priceReadjustmentController };
