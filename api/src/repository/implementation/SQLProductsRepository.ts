import DBConnectionPool from "../../config/database";
import Helper from "../../helper/helper";
import ProductPriceUpdateModel from "../../model/ProductPriceUpdateModel";
import ProductsWithPacksModel from "../../model/ProductsWithPacksModel";
import ProductsRepository from "../ProductsRepository";
import { v4 as uuidv4 } from "uuid";

class SQLProductsRepository implements ProductsRepository {
  async listProductsWithPacksByCode(codes: number[]): Promise<Map<number, ProductsWithPacksModel>> {
    const sql =
      "select products.*, packs.pack_id, packs.qty from products left join " +
      "packs on products.code = packs.product_id where products.code in (?)";
    const [rows] = await DBConnectionPool.query(sql, [codes]);

    const map = new Map<number, ProductsWithPacksModel>();
    (rows as any).forEach((row: any) => {
      const coverted = Helper.convertKeysToCamelCase<ProductsWithPacksModel>(row);
      map.set(Number(coverted.code), {
        code: Number(coverted.code),
        name: coverted.name,
        costPrice: Number(coverted.costPrice),
        salesPrice: Number(coverted.salesPrice),
        packId: coverted.packId ? Number(coverted.packId) : null,
        qty: coverted.qty ? Number(coverted.qty) : null,
      });
    });
    return map;
  }

  async listPacksByProductCode(codes: number[]): Promise<Map<number, PackModel[]>> {
    const sql = "select * from packs where pack_id in (?)";
    const [rows] = await DBConnectionPool.query(sql, [codes]);

    const map = new Map<number, PackModel[]>();
    (rows as any).forEach((row: any) => {
      const converted = Helper.convertKeysToCamelCase<PackModel>(row);
      const obj = {
        id: Number(converted.id),
        packId: Number(converted.packId),
        productId: Number(converted.productId),
        qty: Number(converted.qty),
      };
      const alreadyInMap = map.get(Number(converted.packId));
      if (alreadyInMap) {
        alreadyInMap.push(obj);
        map.set(Number(converted.packId), alreadyInMap);
      } else {
        map.set(Number(converted.packId), [obj]);
      }
    });
    return map;
  }

  async saveUpdates(priceUpdates: ProductPriceUpdateModel[]): Promise<string> {
    const sql = "insert into price_updates (update_id, product_code, new_price) values (?, ?, ?)";
    const updateId = uuidv4();

    priceUpdates.forEach(async ({ productCode, newPrice }) => {
      await DBConnectionPool.query(sql, [updateId, productCode, newPrice]);
    });

    return updateId;
  }

  async commitPriceUpdates(updateId: string): Promise<void> {
    const [rows] = await DBConnectionPool.query("select * from price_updates where update_id = ?", [updateId]);

    (rows as any).forEach(async (row: any) => {
      await DBConnectionPool.query("update products set sales_price = ? where code = ?", [
        row["new_price"],
        row["product_code"],
      ]);
    });

    await DBConnectionPool.query("delete from price_updates where update_id = ?", [updateId]);
  }
}

export default SQLProductsRepository;
