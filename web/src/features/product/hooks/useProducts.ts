import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { getProducts } from "../productThunks";

export const useProducts = () => {
    const dispatch = useAppDispatch();
    const { items, status, error } = useAppSelector((state) => state.product);

    useEffect(() => {
        if (status === "idle") {
            dispatch(getProducts());
        }
    }, [status, dispatch]);

    return { products: items, status, error };
};
