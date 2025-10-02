import { NewProduct, Product } from "../../domain/entities/Product";

export interface  ProductDataSource {
  getProducts(): Promise<Product[]>;
  getProductById(id: string): Promise<Product | null>;
  addProduct(product: NewProduct): Promise<Product>;
  updateProduct(product: Product): Promise<Product>;
  deleteProduct(id: string): Promise<void>;
  getById(id: string): Promise<Product | undefined>;
}

