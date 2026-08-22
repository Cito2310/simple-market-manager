import { createAsyncThunk } from "@reduxjs/toolkit";
import type { Category } from "@shared/types/Category";
import { request } from "../../app/api";

// La API devuelve la forma compartida de Category más la version key de Mongo
export type ApiCategory = Category & { __v: number };

// Todo lo que la API necesita para crear una categoría; del resto se encarga el server - MOVER EN FUTURO
export type CategoryInput = Omit<Category, "_id" | "createdAt" | "updatedAt">;

export const getCategories = createAsyncThunk<ApiCategory[]>("category/getCategories", () =>
    request<ApiCategory[]>("/api/categories")
);

export const createCategory = createAsyncThunk<ApiCategory, CategoryInput>("category/createCategory", (category) =>
    request<ApiCategory>("/api/categories", { method: "POST", body: JSON.stringify(category) })
);

export const updateCategory = createAsyncThunk<ApiCategory, ApiCategory>("category/updateCategory", (category) =>
    request<ApiCategory>(`/api/categories/${category._id}`, { method: "PUT", body: JSON.stringify(category) })
);

export const deleteCategory = createAsyncThunk<string, string>("category/deleteCategory", async (id) => {
    await request<void>(`/api/categories/${id}`, { method: "DELETE" });
    return id;
});
