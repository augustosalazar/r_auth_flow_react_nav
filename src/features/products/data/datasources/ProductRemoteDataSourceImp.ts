import { ILocalPreferences } from "@/src/core/iLocalPreferences";
import { LocalPreferencesAsyncStorage } from "@/src/core/LocalPreferencesAsyncStorage";
import { AuthRemoteDataSourceImpl } from "@/src/features/auth/data/datasources/AuthRemoteDataSourceImp";
import { NewProduct, Product } from "../../domain/entities/Product";
import { ProductDataSource } from "./ProductDataSource";

export class ProductRemoteDataSourceImp implements ProductDataSource {
  private contract = "contract_flutterdemo_ebabe79ab0";
  private baseUrl = "https://roble-api.openlab.uninorte.edu.co";
  private table = "Product";

  private prefs: ILocalPreferences;
  private authService: AuthRemoteDataSourceImpl;

  constructor() {
    this.prefs = LocalPreferencesAsyncStorage.getInstance();
    this.authService = new AuthRemoteDataSourceImpl();
  }

  private async authorizedFetch(
    url: string,
    options: RequestInit,
    retry = true
  ): Promise<Response> {
    const token = await this.prefs.retrieveData<string>("token");
    const headers = {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
    };

    const response = await fetch(url, { ...options, headers });

    if (response.status === 401 && retry) {
      console.warn("401 detected, trying to refresh token…");
      try {
        const refreshed = await this.authService.refreshToken();
        if (refreshed) {
          // retry with new token
          const newToken = await this.prefs.retrieveData<string>("token");
          const retryHeaders = {
            ...(options.headers || {}),
            Authorization: `Bearer ${newToken}`,
          };
          return await fetch(url, { ...options, headers: retryHeaders });
        }
      } catch (e) {
        console.error("Token refresh failed, forcing logout", e);
        // Here you might trigger logout context/state
      }
    }

    return response;
  }

  async getProducts(): Promise<Product[]> {
    const url = `${this.baseUrl}/database/${this.contract}/read?tableName=${this.table}`;

    const response = await this.authorizedFetch(url, { method: "GET" });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Unauthorized (token issue)");
      }
      throw new Error(`Error fetching products: ${response.status}`);
    }

    const data = await response.json();

    // Here we assume the API returns a valid Product[]
    return data as Product[];
  }

  async getProductById(id: string): Promise<Product | undefined> {
    const url = `${this.baseUrl}/database/${this.contract}/read?tableName=${this.table}&_id=${id}`;

    const response = await this.authorizedFetch(url, { method: "GET" });

    if (response.status === 200) {
      const data: Product[] = await response.json();
      return data.length > 0 ? data[0] : undefined;
    } else if (response.status === 401) {
      throw new Error("Unauthorized (token issue)");
    } else {
      const errorBody = await response.json().catch(() => ({}));
      throw new Error(
        `Error fetching product by id: ${response.status} - ${
          errorBody.message ?? "Unknown error"
        }`
      );
    }
  }
  async addProduct(product: NewProduct): Promise<void> {
    const url = `${this.baseUrl}/database/${this.contract}/insert`;

    const body = JSON.stringify({
      tableName: this.table,
      records: [product], // 👈 the API expects an array of records
    });

    const response = await this.authorizedFetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    });

    if (response.status === 201) {
      return Promise.resolve();
    } else if (response.status === 401) {
      throw new Error("Unauthorized (token issue)");
    } else {
      const errorBody = await response.json().catch(() => ({}));
      throw new Error(
        `Error adding product: ${response.status} - ${
          errorBody.message ?? "Unknown error"
        }`
      );
    }
  }

  async updateProduct(product: Product): Promise<void> {
    const url = `${this.baseUrl}/database/${this.contract}/update`;

    const { _id, ...updates } = product; // 👈 separate id from fields

    const body = JSON.stringify({
      tableName: this.table,
      idColumn: "_id",
      idValue: _id,
      updates,
    });

    const response = await this.authorizedFetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body,
    });

    if (response.status === 200) {
      return Promise.resolve();
    } else if (response.status === 401) {
      throw new Error("Unauthorized (token issue)");
    } else {
      const errorBody = await response.json().catch(() => ({}));
      throw new Error(
        `Error updating product: ${response.status} - ${
          errorBody.message ?? "Unknown error"
        }`
      );
    }
  }

  async deleteProduct(id: string): Promise<void> {
    const url = `${this.baseUrl}/database/${this.contract}/delete`;

    const body = JSON.stringify({
      tableName: this.table,
      idColumn: "_id",
      idValue: id,
    });

    const response = await this.authorizedFetch(url, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body,
    });

    if (response.status === 200) {
      return Promise.resolve();
    } else if (response.status === 401) {
      throw new Error("Unauthorized (token issue)");
    } else {
      const errorBody = await response.json().catch(() => ({}));
      throw new Error(
        `Error deleting product: ${response.status} - ${
          errorBody.message ?? "Unknown error"
        }`
      );
    }
  }
}
