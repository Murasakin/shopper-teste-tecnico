import Helper from "../helper/helper";
import ProductsModel from "../model/ProductModel";
import ProductsWithPacksModel from "../model/ProductsWithPacksModel";
import ValidationResultModel from "../model/ValidationResultModel";
import ValidationResultResponseModel from "../model/ValidationResultResponseModel";
import ProductsRepository from "../repository/ProductsRepository";
import { ValidateCSVDataCommand } from "./ValidateCSVData.command";

class ValidateCSVData {
  constructor(private repository: ProductsRepository) {}

  async execute(command: ValidateCSVDataCommand): Promise<ValidationResultResponseModel> {
    const products = await this.getProducts(command);
    const packs = await this.getWhichProductsArePacks(products);

    const resultMap = this.runFirstValidations(command, products);
    this.runPackValidations(packs, products, resultMap);

    const resultArray = Array.from(resultMap.values());
    if (resultArray.every((value) => !value.error)) {
      const updateId = await this.repository.saveUpdates(
        resultArray.map((value) => ({ productCode: Number(value.code), newPrice: Number(value.readjustedPrice) }))
      );
      return { updateId, results: resultArray };
    }

    return { updateId: undefined, results: resultArray };
  }

  private async getProducts(command: ValidateCSVDataCommand) {
    const { data, columns } = command;
    const queryCodes = data.map((value) => Number(value[columns[0]])).filter((value) => !Number.isNaN(value));
    return await this.repository.listProductsWithPacksByCode(queryCodes);
  }

  private async getWhichProductsArePacks(products: Map<number, ProductsWithPacksModel>) {
    const queryCodes = Array.from(products.keys());
    return await this.repository.listPacksByProductCode(queryCodes);
  }

  private runFirstValidations(command: ValidateCSVDataCommand, products: Map<number, ProductsWithPacksModel>) {
    const { data, columns } = command;
    const resultMap = new Map<string, ValidationResultModel>();

    for (let i = 0; i < data.length; i++) {
      const result: ValidationResultModel = {
        code: data[i][columns[0]],
        productName: "",
        currentPrice: "0.00",
        readjustedPrice: data[i][columns[1]],
        error: undefined,
      };

      const codeValidation = this.codeValidation(Number(result.code), products);
      if (!codeValidation.success) {
        result.error = codeValidation.error;
        resultMap.set(result.code, result);
        continue;
      }

      const product = products.get(Number(result.code));
      result.currentPrice = Helper.decimalNumberToString(product.salesPrice);
      result.productName = product.name;

      const newPriceValidation = this.newPriceValidations(
        Number(result.readjustedPrice),
        product.salesPrice,
        product.costPrice
      );
      if (!newPriceValidation.success) {
        result.error = newPriceValidation.error;
      }

      resultMap.set(result.code, result);
    }
    return resultMap;
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

  private runPackValidations(
    packs: Map<number, PackModel[]>,
    products: Map<number, ProductsWithPacksModel>,
    resultMap: Map<string, ValidationResultModel>
  ) {
    this.packMissingComponentsValidation(packs, resultMap);
    this.componentNoPackPresentValidation(products, resultMap);
  }

  private packMissingComponentsValidation(
    packs: Map<number, PackModel[]>,
    resultMap: Map<string, ValidationResultModel>
  ) {
    const packsResultArray = Array.from(resultMap.values()).filter(
      (value) => !value.error && packs.get(Number(value.code))
    );
    for (let i = 0; i < packsResultArray.length; i++) {
      const item = packsResultArray[i];
      const pack = packs.get(Number(item.code));
      const components = pack.map((value) => [value.productId, value.qty]);
      const diffNewPackPrice =
        Math.round(Number(item.readjustedPrice) * 100) - Math.round(Number(item.currentPrice) * 100);

      let sum = 0;
      components.forEach((value) => {
        const componentResult = resultMap.get(value[0].toString());
        if (componentResult) {
          const newComponentPrice = Number(componentResult.readjustedPrice) * 100;
          const currentComponentPrice = Number(componentResult.currentPrice) * 100;
          sum += value[1] * (newComponentPrice - currentComponentPrice);
        }
      });
      console.log(diffNewPackPrice);
      console.log(sum);
      if (sum !== diffNewPackPrice) {
        item.error =
          "Para reajustar o preço de um pacote, deve-se constar também preços de reajuste válidos " +
          "(que não quebre as demais regras) para seus componentes, de modo que o preço do pacote " +
          "continue sendo a soma dos preços de seus componentes";
      }
    }
  }

  private componentNoPackPresentValidation(
    products: Map<number, ProductsWithPacksModel>,
    resultMap: Map<string, ValidationResultModel>
  ) {
    const componentsArray = Array.from(products.values()).filter(
      (value) => !resultMap.get(value.code.toString()).error && value.packId
    );
    for (let i = 0; i < componentsArray.length; i++) {
      const item = componentsArray[i];
      const componentResult = resultMap.get(item.code.toString());
      const packResult = resultMap.get(item.packId.toString());
      if (!packResult) {
        componentResult.error =
          "Para reajustar o preço de um produto que faz parte de um pacote, deve-se constar também um preço " +
          "de reajuste válido (que não quebre as demais regras) para seu pacote em questão.";
      }
      resultMap.set(componentResult.code, componentResult);
    }
  }
}

export default ValidateCSVData;
