// src/context/productContext.tsx
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { ProductLocalDataSource } from "@/src/features/products/data/datasources/ProductLocalDataSource";
import { ProductRepositoryImpl } from "@/src/features/products/data/repositories/ProductRepositoryImpl";
import { NewProduct, Product } from "@/src/features/products/domain/entities/Product";
import { AddProductUseCase } from "@/src/features/products/domain/usecases/AddProductUseCase";
import { DeleteProductUseCase } from "@/src/features/products/domain/usecases/DeleteProductUseCase";
import { GetProductByIdUseCase } from "@/src/features/products/domain/usecases/GetProductByIdUseCase";
import { GetProductsUseCase } from "@/src/features/products/domain/usecases/GetProductsUseCase";
import { UpdateProductUseCase } from "@/src/features/products/domain/usecases/UpdateProductUseCase";

// --- Setup repo + usecases ---
const repo = new ProductRepositoryImpl(new ProductLocalDataSource());
const addProductUC = new AddProductUseCase(repo);
const updateProductUC = new UpdateProductUseCase(repo);
const deleteProductUC = new DeleteProductUseCase(repo);
const getProductsUC = new GetProductsUseCase(repo);
const getProductByIdUC = new GetProductByIdUseCase(repo);

// --- Context ---
type ProductContextType = {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  addProduct: (product: NewProduct) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  removeProduct: (id: string) => Promise<void>;
  getProduct: (id: string) => Promise<Product | undefined>;
  refreshProducts: () => Promise<void>;
};

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const list = await getProductsUC.execute();
      setProducts(list);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const addProduct = async (product: NewProduct) => {
    try {
      setIsLoading(true);
      setError(null);
      await addProductUC.execute(product);
      await refreshProducts();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProduct = async (product: Product) => {
    try {
      setIsLoading(true);
      setError(null);
      await updateProductUC.execute(product);
      await refreshProducts();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const removeProduct = async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await deleteProductUC.execute(id);
      await refreshProducts();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const getProduct = async (id: string) => {
    console.log("Getting product with id:", id);
    try {
      setIsLoading(true);
      setError(null);
      return await getProductByIdUC.execute(id);
    } catch (e) {
      setError((e as Error).message);
      return undefined;
    } finally {
      setIsLoading(false);
    }
  };

  // Load products initially
  useEffect(() => {
    refreshProducts();
  }, []);

  const value = useMemo(
    () => ({
      products,
      isLoading,
      error,
      addProduct,
      updateProduct,
      removeProduct,
      getProduct,
      refreshProducts,
    }),
    [products, isLoading, error]
  );

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
}

export function useProducts() {
  const ctx = useContext(ProductContext);
  if (!ctx) {
    throw new Error("useProducts must be used inside ProductProvider");
  }
  return ctx;
}
