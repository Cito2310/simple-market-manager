import { createSlice } from "@reduxjs/toolkit";
import type { RequestStatus } from "@shared/types/Request";
import type { ProductApi } from "@shared/types/Product";
import { createProduct, deleteProduct, getProducts, updateProduct } from "./productThunks";

interface ProductState {
    items: ProductApi[];
    status: RequestStatus;
    error: string | null;
}

const initialState: ProductState = {
    items: [],
    status: "idle",
    error: null
};

const productSlice = createSlice({
    name: "product",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getProducts.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(getProducts.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.items = action.payload;
            })
            .addCase(getProducts.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message ?? "Unknown error";
            })
            .addCase(createProduct.fulfilled, (state, action) => {
                state.items.unshift(action.payload);
            })
            .addCase(updateProduct.fulfilled, (state, action) => {
                const index = state.items.findIndex((item) => item._id === action.payload._id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.items = state.items.filter((item) => item._id !== action.payload);
            });
    }
});

export const productReducer = productSlice.reducer;
