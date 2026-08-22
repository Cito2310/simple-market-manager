import { useCallback, useState } from "react";
import { useAppDispatch } from "../../../app/store";
import type { ApiProduct } from "../productThunks";
import { deleteProduct } from "../productThunks";

export const useProductDelete = () => {
    const dispatch = useAppDispatch();
    const [deleteTarget, setDeleteTarget] = useState<ApiProduct | undefined>(undefined);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    const requestDelete = useCallback((product: ApiProduct): void => {
        setDeleteTarget(product);
        setDeleteError(null);
    }, []);

    const cancelDelete = useCallback((): void => {
        setDeleteTarget(undefined);
        setDeleteError(null);
    }, []);

    const confirmDelete = useCallback(async (): Promise<void> => {
        if (!deleteTarget) {
            return;
        }
        setIsDeleting(true);
        setDeleteError(null);
        try {
            await dispatch(deleteProduct(deleteTarget._id)).unwrap();
            setDeleteTarget(undefined);
        } catch (error) {
            setDeleteError(error instanceof Error ? error.message : String(error));
        } finally {
            setIsDeleting(false);
        }
    }, [dispatch, deleteTarget]);

    return { deleteTarget, isDeleting, deleteError, requestDelete, cancelDelete, confirmDelete };
};
