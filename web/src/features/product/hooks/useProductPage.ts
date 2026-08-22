import { useCallback, useState } from "react";
import type { ApiProduct } from "../productThunks";
import { useProductDelete } from "./useProductDelete";
import { useProducts } from "./useProducts";

export const useProductPage = () => {
    const { products, status, error } = useProducts();
    const deletion = useProductDelete();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editing, setEditing] = useState<ApiProduct | undefined>(undefined);

    const openCreate = useCallback((): void => {
        setEditing(undefined);
        setIsModalOpen(true);
    }, []);

    const openEdit = useCallback((product: ApiProduct): void => {
        setEditing(product);
        setIsModalOpen(true);
    }, []);

    const closeModal = useCallback((): void => setIsModalOpen(false), []);

    return { products, status, error, isModalOpen, editing, openCreate, openEdit, closeModal, ...deletion };
};
