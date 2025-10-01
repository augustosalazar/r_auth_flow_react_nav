import { NewProduct, Product } from "../../domain/entities/Product";

export class ProductLocalDataSource {
  private products: Product[] = [
    { _id: "1", name: "Apple", description: "Fresh red apple", quantity: 10 },
    { _id: "2", name: "Banana", description: "Yellow banana", quantity: 20 },
  ];

  async getProducts(): Promise<Product[]> {
    return this.products;
  }

  async getProductById(id: string): Promise<Product | null> {
    return this.products.find((p) => p._id === id) || null;
  }

  async addProduct(product: NewProduct): Promise<Product> {
    const maxId = this.products.reduce((max, p) => Math.max(max, Number(p._id)), 0);
    const newProduct: Product = {
      _id: String(maxId + 1),
      ...product,
    };
    this.products.push(newProduct);
    return newProduct;
  }

  async updateProduct(product: Product): Promise<Product> {
    const index = this.products.findIndex((p) => p._id === product._id);
    if (index === -1) throw new Error("Product not found");
    this.products[index] = product;
    return product;
  }

  async deleteProduct(id: string): Promise<void> {
    this.products = this.products.filter((p) => p._id !== id);
  }

  async getById(id: string): Promise<Product | undefined> {
    return this.products.find(p => p._id === id);
  }
}
