import { Request, Response } from "express";
import DBConnectionPool from "../config/database";
import ValidateCSVData from "../use-cases/ValidateCSVData";
import { ValidateCSVDataCommand } from "../use-cases/ValidateCSVData.command";
import UpdatePricesCommand from "../use-cases/UpdatePrices.command";
import UpdatePrices from "../use-cases/UpdatePrices";

export default class PriceReadjustmentController {
  constructor(private validateCsvData: ValidateCSVData, private updatePrices: UpdatePrices) {}

  async validate(request: Request, response: Response) {
    const command = request.body as ValidateCSVDataCommand;

    const result = await this.validateCsvData.execute(command);

    return response.status(200).json(result);
  }

  async update(request: Request, response: Response) {
    const command = request.body as UpdatePricesCommand;

    await this.updatePrices.execute(command);

    return response.status(204).send();
  }
}
