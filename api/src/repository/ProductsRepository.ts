import ProductsModel from "../model/ProductModel";

export default interface ProductRepository {
  listManyByCode: (codes: number[]) => Promise<Map<number, Omit<ProductsModel, "code">>>;
}
