import { useCallback, useState } from "react";
import type { Product } from "@shared/types/Product";

// El modal queda abierto despues de agregar: se pueden cargar varios productos seguidos
export const useProductSearchModal = (addProduct: (product: Product) => void) => {
    const [isOpen, setIsOpen] = useState(false);

    const open = useCallback((): void => setIsOpen(true), []);

    const close = useCallback((): void => setIsOpen(false), []);

    return { isOpen, open, close, selectProduct: addProduct };
};

export type ProductSearchModalState = ReturnType<typeof useProductSearchModal>;
