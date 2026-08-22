import { createSlice } from "@reduxjs/toolkit";
import type { ApiCategory } from "./categoryThunks";
import { createCategory, deleteCategory, getCategories, updateCategory } from "./categoryThunks";

export type RequestStatus = "idle" | "loading" | "succeeded" | "failed";

interface CategoryState {
    items: ApiCategory[];
    status: RequestStatus;
    error: string | null;
}

const initialState: CategoryState = {
    items: [],
    status: "idle",
    error: null
};

const categorySlice = createSlice({
    name: "category",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getCategories.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(getCategories.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.items = action.payload;
            })
            .addCase(getCategories.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message ?? "Unknown error";
            })
            .addCase(createCategory.fulfilled, (state, action) => {
                state.items.unshift(action.payload);
            })
            .addCase(updateCategory.fulfilled, (state, action) => {
                const index = state.items.findIndex((item) => item._id === action.payload._id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            })
            .addCase(deleteCategory.fulfilled, (state, action) => {
                state.items = state.items.filter((item) => item._id !== action.payload);
            });
    }
});

export const categoryReducer = categorySlice.reducer;
