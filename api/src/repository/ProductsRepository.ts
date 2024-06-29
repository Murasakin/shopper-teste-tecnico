import ProductPriceUpdateModel from "../model/ProductPriceUpdateModel";
import ProductsWithPacksModel from "../model/ProductsWithPacksModel";

export default interface ProducstRepository {
  listProductsWithPacksByCode: (codes: number[]) => Promise<Map<number, ProductsWithPacksModel>>;
  listPacksByProductCode(codes: number[]): Promise<Map<number, PackModel[]>>;
  saveUpdates(priceUpdates: ProductPriceUpdateModel[]): Promise<string>;
  commitPriceUpdates(updateId: string): Promise<void>;
}
