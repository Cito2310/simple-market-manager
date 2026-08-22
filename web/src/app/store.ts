import { configureStore } from "@reduxjs/toolkit";
import { categoryReducer } from "../features/category/categorySlice";
import { productReducer } from "../features/product/productSlice";

export const store = configureStore({
    reducer: {
        category: categoryReducer,
        product: productReducer
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
