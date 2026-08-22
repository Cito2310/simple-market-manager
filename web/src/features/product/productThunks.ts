import { createAsyncThunk } from "@reduxjs/toolkit";
import type { ProductApi, ProductInput } from "@shared/types/Product";
import { request } from "../../app/api";

export const getProducts = createAsyncThunk<ProductApi[]>("product/getProducts", () =>
    request<ProductApi[]>("/api/products")
);

export const createProduct = createAsyncThunk<ProductApi, ProductInput>("product/createProduct", (product) =>
    request<ProductApi>("/api/products", { method: "POST", body: JSON.stringify(product) })
);

export const updateProduct = createAsyncThunk<ProductApi, ProductApi>("product/updateProduct", (product) =>
    request<ProductApi>(`/api/products/${product._id}`, { method: "PUT", body: JSON.stringify(product) })
);

export const deleteProduct = createAsyncThunk<string, string>("product/deleteProduct", async (id) => {
    await request<void>(`/api/products/${id}`, { method: "DELETE" });
    return id;
});
