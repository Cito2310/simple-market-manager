import { useCallback, useState } from "react";

// Cancelar descarta el ticket entero: se pide confirmacion porque no hay forma de recuperarlo
export const useCancelSale = (discardSale: () => void) => {
    const [isOpen, setIsOpen] = useState(false);

    const open = useCallback((): void => setIsOpen(true), []);

    const close = useCallback((): void => setIsOpen(false), []);

    const confirm = useCallback((): void => {
        discardSale();
        setIsOpen(false);
    }, [discardSale]);

    return { isOpen, open, close, confirm };
};

export type CancelSaleState = ReturnType<typeof useCancelSale>;
