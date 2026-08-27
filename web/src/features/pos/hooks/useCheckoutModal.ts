import { useCallback, useState } from "react";
import type { Payment } from "@shared/types/Ticket";

// Cobrar ya no guarda directo: primero se cargan los medios de pago en el modal
export const useCheckoutModal = (saveSale: (payments: Payment[]) => void) => {
    const [isOpen, setIsOpen] = useState(false);
    // Imprimir todavia no esta implementado: por ahora solo queda la eleccion del cajero
    const [printTicket, setPrintTicket] = useState(false);

    const open = useCallback((): void => {
        setPrintTicket(false);
        setIsOpen(true);
    }, []);

    const close = useCallback((): void => setIsOpen(false), []);

    const togglePrintTicket = useCallback((): void => setPrintTicket((current) => !current), []);

    const confirm = useCallback(
        (payments: Payment[]): void => {
            saveSale(payments);
            setIsOpen(false);
        },
        [saveSale]
    );

    return { isOpen, printTicket, open, close, togglePrintTicket, confirm };
};

export type CheckoutModalState = ReturnType<typeof useCheckoutModal>;
