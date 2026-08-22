import { useAppSelector } from "../../../app/hooks";

export const useProducts = () => {
    const { items, status, error } = useAppSelector((state) => state.product);

    return { products: items, status, error };
};
