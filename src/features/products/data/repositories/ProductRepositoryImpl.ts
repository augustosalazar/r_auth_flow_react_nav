import { NewProduct, Product } from "../../domain/entities/Product";
import { ProductRepository } from "../../domain/repositories/ProductRepository";
import { ProductLocalDataSource } from "../datasources/ProductLocalDataSource";

export class ProductRepositoryImpl implements ProductRepository {
  constructor(private local: ProductLocalDataSource) {}

  async getProducts(): Promise<Product[]> {
    return this.local.getProducts();
  }

  async getProductById(id: string): Promise<Product | null> {
    return this.local.getProductById(id);
  }

  async addProduct(product: NewProduct): Promise<Product> {
    return this.local.addProduct(product);
  }

  async updateProduct(product: Product): Promise<Product> {
    return this.local.updateProduct(product);
  }

  async deleteProduct(id: string): Promise<void> {
    return this.local.deleteProduct(id);
  }

  async getById(id: string): Promise<Product | undefined> {
    return this.local.getById(id);
  }
}
