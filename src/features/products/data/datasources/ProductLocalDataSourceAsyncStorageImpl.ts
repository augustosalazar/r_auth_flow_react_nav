import { ILocalPreferences } from "@/src/core/iLocalPreferences";
import { NewProduct, Product } from "../../domain/entities/Product";
import { ProductDataSource } from "./ProductDataSource";

export class ProductLocalDataSourceAsyncStorageImpl implements ProductDataSource {
  constructor(private localPreferences: ILocalPreferences) {}

  async getProducts(): Promise<Product[]> {
    const products: Product[] = await this.localPreferences.getAllEntries<Product>("products");
    console.log("Retrieving products from local storage data source:", products);
    return products;
  }

  async getProductById(id: string): Promise<Product | null> {
    const products = await this.getProducts();
    return products.find((p) => p._id === id) || null;
  }

  async addProduct(product: NewProduct): Promise<Product> {
    const maxId = (await this.getProducts()).reduce((max, p) => Math.max(max, Number(p._id)), 0);
    const newProduct: Product = {
      _id: String(maxId + 1),
      ...product,
    };
    await this.localPreferences.storeEntry<Product>("products", newProduct);
    return newProduct;
  }

  async updateProduct(product: Product): Promise<Product> {
    const products = await this.getProducts();
    const index = products.findIndex((p) => p._id === product._id);
    if (index === -1) throw new Error("Product not found");
    products[index] = product;
    await this.localPreferences.replaceEntries<Product>("products", products);
    return product;
  }

  async deleteProduct(id: string): Promise<void> {
    const products = await this.getProducts();
    await this.localPreferences.replaceEntries<Product>("products", products.filter((p) => p._id !== id));
  }

  async getById(id: string): Promise<Product | undefined> {
    const products = await this.getProducts();
    return products.find(p => p._id === id);
  }
}
