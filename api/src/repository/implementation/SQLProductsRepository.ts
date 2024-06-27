import DBConnectionPool from "../../config/database";
import Helper from "../../helper/helper";
import ProductsModel from "../../model/ProductModel";
import ProductRepository from "../ProductsRepository";

class SQLProductsRepository implements ProductRepository {
  async listManyByCode(codes: number[]): Promise<Map<number, Omit<ProductsModel, "code">>> {
    const [rows] = await DBConnectionPool.query("SELECT * from products where code in (?)", [codes]);

    const map = new Map<number, Omit<ProductsModel, "code">>();
    (rows as any).forEach((row: any) => {
      const coverted = Helper.convertKeysToCamelCase<ProductsModel>(row);
      map.set(Number(coverted.code), {
        name: coverted.name,
        costPrice: Number(coverted.costPrice),
        salesPrice: Number(coverted.salesPrice),
      });
    });
    return map;
  }
}

export default SQLProductsRepository;
