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

    
    getProductById(id: string): Promise<Product | null> {
        throw new Error("Method not implemented.");
    }
    addProduct(product: NewProduct): Promise<Product> {
        throw new Error("Method not implemented.");
    }
    updateProduct(product: Product): Promise<Product> {
        throw new Error("Method not implemented.");
    }
    deleteProduct(id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    getById(id: string): Promise<Product | undefined> {
        throw new Error("Method not implemented.");
    }

}