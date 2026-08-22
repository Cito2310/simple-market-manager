import { createAsyncThunk } from "@reduxjs/toolkit";
import type { Product } from "@shared/types/Product";
import { API_URL } from "../../app/api";

// The API returns the shared Product shape plus Mongo's version key
export type ApiProduct = Product & { __v: number };

// Everything the API needs to create a product; the server owns the rest
export type ProductInput = Omit<Product, "_id" | "createdAt" | "updatedAt">;

const request = async <T>(path: string, init?: RequestInit): Promise<T> => {
    const response = await fetch(`${API_URL}${path}`, {
        headers: { "Content-Type": "application/json" },
        ...init
    });
    const text = await response.text();

    if (!response.ok) {
        // The server still answers validation errors with HTML, so fall back to the status
        try {
            throw new Error(JSON.parse(text).message ?? `Error ${response.status}`);
        } catch (error) {
            throw error instanceof SyntaxError ? new Error(`Error ${response.status}`) : error;
        }
    }
    return text ? JSON.parse(text) : (undefined as T);
};

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
