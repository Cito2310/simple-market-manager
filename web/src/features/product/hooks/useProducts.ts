import { useAppSelector } from "../../../app/store";

export const useProducts = () => {
    const { items, status, error } = useAppSelector((state) => state.product);

    return { products: items, status, error };
};
