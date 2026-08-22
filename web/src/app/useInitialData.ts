import { useEffect } from "react";
import { getCategories } from "../features/category/categoryThunks";
import { getProducts } from "../features/product/productThunks";
import { useAppDispatch, useAppSelector } from "./hooks";

export const useInitialData = (): void => {
    const dispatch = useAppDispatch();
    const productStatus = useAppSelector((state) => state.product.status);
    const categoryStatus = useAppSelector((state) => state.category.status);

    useEffect(() => {
        if (productStatus === "idle") {
            dispatch(getProducts());
        }
    }, [productStatus, dispatch]);

    useEffect(() => {
        if (categoryStatus === "idle") {
            dispatch(getCategories());
        }
    }, [categoryStatus, dispatch]);
};
