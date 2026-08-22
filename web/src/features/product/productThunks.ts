import { createAsyncThunk } from "@reduxjs/toolkit";
import type { Product } from "@shared/types/Product";
import { request } from "../../app/api";

// La API devuelve la forma compartida de Product más la version key de Mongo
export type ApiProduct = Product & { __v: number };

// Todo lo que la API necesita para crear un producto; del resto se encarga el server
export type ProductInput = Omit<Product, "_id" | "createdAt" | "updatedAt">;

export const getProducts = createAsyncThunk<ApiProduct[]>("product/getProducts", () =>
    request<ApiProduct[]>("/api/products")
);

export const createProduct = createAsyncThunk<ApiProduct, ProductInput>("product/createProduct", (product) =>
    request<ApiProduct>("/api/products", { method: "POST", body: JSON.stringify(product) })
);

export const updateProduct = createAsyncThunk<ApiProduct, ApiProduct>("product/updateProduct", (product) =>
    request<ApiProduct>(`/api/products/${product._id}`, { method: "PUT", body: JSON.stringify(product) })
);

export const deleteProduct = createAsyncThunk<string, string>("product/deleteProduct", async (id) => {
    await request<void>(`/api/products/${id}`, { method: "DELETE" });
    return id;
});
