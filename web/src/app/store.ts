import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";
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

// Versiones tipadas de los hooks de react-redux, para no repetir los tipos en cada feature
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
