import ProductsRepository from "../repository/ProductsRepository";
import UpdatePricesCommand from "./UpdatePrices.command";

class UpdatePrices {
  constructor(private repository: ProductsRepository) {}

  async execute(command: UpdatePricesCommand) {
    const { updateId } = command;

    await this.repository.commitPriceUpdates(updateId);
  }
}

export default UpdatePrices;
