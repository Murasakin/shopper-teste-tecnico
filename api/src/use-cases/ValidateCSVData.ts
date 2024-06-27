import Helper from "../helper/helper";
import ProductsModel from "../model/ProductModel";
import ValidationResultModel from "../model/ValidationResultModel";
import ProductRepository from "../repository/ProductsRepository";
import { ValidateCSVDataCommand } from "./ValidateCSVData.command";

class ValidateCSVData {
  constructor(private repository: ProductRepository) {}

  async execute(command: ValidateCSVDataCommand): Promise<ValidationResultModel[]> {
    const { data, columns } = command;
    const products = await this.getProducts(command);

    return data.map((value) => {
      const result: ValidationResultModel = {
        code: value[columns[0]],
        productName: "",
        currentPrice: "0.00",
        readjustedPrice: value[columns[1]],
        error: undefined,
      };
      const codeAsNumber = Number(result.code);
      const newPriceAsNumber = Number(result.readjustedPrice);

      const codeValidation = this.codeValidation(codeAsNumber, products);
      if (!codeValidation.success) {
        result.error = codeValidation.error;
        return result;
      }

      const product = products.get(codeAsNumber);
      result.currentPrice = Helper.decimalNumberToString(product.salesPrice);
      result.productName = product.name;

      const newPriceValidation = this.newPriceValidations(newPriceAsNumber, product.salesPrice, product.costPrice);
      if (!newPriceValidation.success) {
        result.error = newPriceValidation.error;
      }

      return result;
    });
  }

  private async getProducts(command: ValidateCSVDataCommand) {
    const { data, columns } = command;
    const queryCodes = data.map((value) => Number(value[columns[0]])).filter((value) => !Number.isNaN(value));
    return await this.repository.listManyByCode(queryCodes);
  }

  private codeValidation(
    code: number,
    products: Map<number, Omit<ProductsModel, "code">>
  ): { success: boolean; error?: string } {
    if (Number.isNaN(code)) {
      return { success: false, error: "Código de produto inválido!" };
    }
    if (!products.has(code)) {
      return { success: false, error: "Código de produto inexistente na base de dados!" };
    }
    return { success: true };
  }

  private newPriceValidations(
    newPrice: number,
    currentPrice: number,
    costPrice: number
  ): { success: boolean; error?: string } {
    const upperLimit = currentPrice * 1.1;
    const lowerLimit = currentPrice * 0.9;

    if (Number.isNaN(newPrice)) {
      return { success: false, error: "Preço de reajuste informado não é um valor numérico válido." };
    }
    if (newPrice <= costPrice) {
      return {
        success: false,
        error: `Preço de reajuste informado é menor ou igual ao preço de custo do produto.
          Preço de custo: R$ ${Helper.decimalNumberToString(costPrice)}`,
      };
    }
    if (newPrice < lowerLimit) {
      return {
        success: false,
        error: `Valor do reajuste é menor que -10% do valor atual do produto.
          Valor atual: ${Helper.decimalNumberToString(currentPrice)}`,
      };
    }
    if (newPrice > upperLimit) {
      return {
        success: false,
        error: `Valor do reajuste é maior que +10% do valor atual do produto.
          Valor atual: ${Helper.decimalNumberToString(currentPrice)}`,
      };
    }
    return { success: true };
  }

  // todo: packs validation
}

export default ValidateCSVData;
