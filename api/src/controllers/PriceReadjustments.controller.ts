import { Request, Response } from "express";
import DBConnectionPool from "../config/database";
import ValidateCSVData from "../use-cases/ValidateCSVData";
import { ValidateCSVDataCommand } from "../use-cases/ValidateCSVData.command";

export default class PriceReadjustmentController {
  constructor(private validateCsvData: ValidateCSVData) {}

  async validate(request: Request, response: Response) {
    const command = request.body as ValidateCSVDataCommand;

    const result = await this.validateCsvData.execute(command);

    return response.status(200).json(result);
  }
}
