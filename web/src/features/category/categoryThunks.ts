import { createAsyncThunk } from "@reduxjs/toolkit";
import type { CategoryApi, CategoryInput } from "@shared/types/Category";
import { request } from "../../app/api";

export const getCategories = createAsyncThunk<CategoryApi[]>("category/getCategories", () =>
    request<CategoryApi[]>("/api/categories")
);

export const createCategory = createAsyncThunk<CategoryApi, CategoryInput>("category/createCategory", (category) =>
    request<CategoryApi>("/api/categories", { method: "POST", body: JSON.stringify(category) })
);

export const updateCategory = createAsyncThunk<CategoryApi, CategoryApi>("category/updateCategory", (category) =>
    request<CategoryApi>(`/api/categories/${category._id}`, { method: "PUT", body: JSON.stringify(category) })
);

export const deleteCategory = createAsyncThunk<string, string>("category/deleteCategory", async (id) => {
    await request<void>(`/api/categories/${id}`, { method: "DELETE" });
    return id;
});
