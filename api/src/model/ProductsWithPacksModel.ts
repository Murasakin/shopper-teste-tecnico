import ProductsModel from "./ProductModel";

interface ProductsWithPacksModel extends ProductsModel {
  packId: number | null;
  qty: number | null;
}

export default ProductsWithPacksModel;
