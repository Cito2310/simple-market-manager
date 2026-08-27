import { useCallback, useState } from "react";
import type { CashCount, CashMovementType } from "@shared/types/CashSession";
import { buildCashMovement, cashSalesSince } from "../cashOperations";
import { readTickets } from "../posStorage";
import { useCashSession } from "./useCashSession";

export type CashView = "closed" | "opening" | "open" | "movement" | "closing" | "summary";

export const useCashModal = () => {
    const {
        session,
        isSessionOpen,
        openSession,
        addMovement,
        removeMovement,
        closeSession,
        archiveSession
    } = useCashSession();

    const [isOpen, setIsOpen] = useState(false);
    const [view, setView] = useState<CashView>("closed");
    const [movementType, setMovementType] = useState<CashMovementType>("bundle");
    const [cashSales, setCashSales] = useState(0);

    // Las ventas en efectivo salen de los tickets guardados desde que se abrio la caja
    const refreshCashSales = useCallback((from: number): void => {
        setCashSales(cashSalesSince(readTickets(), from));
    }, []);

    const open = useCallback((): void => {
        refreshCashSales(session?.openedAt ?? Date.now());
        setView(isSessionOpen ? "open" : "closed");
        setIsOpen(true);
    }, [session, isSessionOpen, refreshCashSales]);

    const close = useCallback((): void => setIsOpen(false), []);

    const startOpening = useCallback((): void => setView("opening"), []);

    const confirmOpening = useCallback(
        (opening: CashCount): void => {
            openSession(opening);
            refreshCashSales(Date.now());
            setView("open");
        },
        [openSession, refreshCashSales]
    );

    const startMovement = useCallback((type: CashMovementType): void => {
        setMovementType(type);
        setView("movement");
    }, []);

    const confirmMovement = useCallback(
        (amount: number, note: string): void => {
            addMovement(buildCashMovement(movementType, amount, note));
            setView("open");
        },
        [addMovement, movementType]
    );

    const startClosing = useCallback((): void => setView("closing"), []);

    const confirmClosing = useCallback(
        (closing: CashCount): void => {
            closeSession(closing);
            setView("summary");
        },
        [closeSession]
    );

    // El resumen del cierre se muestra antes de archivar: recien ahi la caja queda libre
    const finishClosing = useCallback((): void => {
        archiveSession();
        setView("closed");
        setIsOpen(false);
    }, [archiveSession]);

    const backToSession = useCallback((): void => setView("open"), []);

    const backToClosed = useCallback((): void => setView("closed"), []);

    return {
        isOpen,
        view,
        session,
        cashSales,
        movementType,
        open,
        close,
        startOpening,
        confirmOpening,
        startMovement,
        confirmMovement,
        removeMovement,
        startClosing,
        confirmClosing,
        finishClosing,
        backToSession,
        backToClosed
    };
};

export type CashModalState = ReturnType<typeof useCashModal>;
