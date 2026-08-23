import { useCallback, useState } from "react";
import type { ProductApi } from "@shared/types/Product";
import { useProductDelete } from "./useProductDelete";
import { useProductFilters } from "./useProductFilters";
import { useProducts } from "./useProducts";

export const useProductPage = () => {
    const { products, status, error } = useProducts();
    const filters = useProductFilters(products);
    const deletion = useProductDelete();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editing, setEditing] = useState<ProductApi | undefined>(undefined);

    const openCreate = useCallback((): void => {
        setEditing(undefined);
        setIsModalOpen(true);
    }, []);

    const openEdit = useCallback((product: ProductApi): void => {
        setEditing(product);
        setIsModalOpen(true);
    }, []);

    const closeModal = useCallback((): void => setIsModalOpen(false), []);

    return {
        products,
        status,
        error,
        isModalOpen,
        editing,
        openCreate,
        openEdit,
        closeModal,
        ...deletion,
        ...filters
    };
};
