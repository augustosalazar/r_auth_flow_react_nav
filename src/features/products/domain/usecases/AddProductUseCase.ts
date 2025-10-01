import { NewProduct, Product } from "../entities/Product";
import { ProductRepository } from "../repositories/ProductRepository";

export class AddProductUseCase {
  constructor(private repo: ProductRepository) {}

  async execute(data: NewProduct): Promise<Product> {
    return this.repo.addProduct(data);
  }
}
