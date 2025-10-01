import { NewProduct, Product } from "../entities/Product";

export interface ProductRepository {
  getProducts(): Promise<Product[]>;
  getProductById(id: string): Promise<Product | null>;
  addProduct(product: NewProduct): Promise<Product>;
  updateProduct(product: Product): Promise<Product>;
  deleteProduct(id: string): Promise<void>;
  getById(id: string): Promise<Product | undefined>;
}
