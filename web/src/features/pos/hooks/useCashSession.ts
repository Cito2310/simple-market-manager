import { useCallback, useState } from "react";
import type { CashCount, CashMovement, CashSession } from "@shared/types/CashSession";
import { buildCashSession } from "../cashOperations";
import { archiveCashSession, readCashSession, saveCashSession } from "../cashStorage";

// La sesion vive en localStorage: sobrevive al refresco mientras no exista el modelo de Shift
export const useCashSession = () => {
    const [session, setSession] = useState<CashSession | null>(() => readCashSession());

    // Guardar es un efecto: se hace aca y no dentro del updater, que StrictMode corre dos veces
    const persist = useCallback((next: CashSession | null): void => {
        saveCashSession(next);
        setSession(next);
    }, []);

    const openSession = useCallback(
        (opening: CashCount): void => persist(buildCashSession(opening)),
        [persist]
    );

    const addMovement = useCallback(
        (movement: CashMovement): void => {
            if (!session) return;

            persist({ ...session, movements: [...session.movements, movement] });
        },
        [session, persist]
    );

    // Un taco se puede romper para dar cambio: en ese caso se borra el registro
    const removeMovement = useCallback(
        (movementId: string): void => {
            if (!session) return;

            persist({
                ...session,
                movements: session.movements.filter((movement) => movement._id !== movementId)
            });
        },
        [session, persist]
    );

    const closeSession = useCallback(
        (closing: CashCount): void => {
            if (!session) return;

            persist({ ...session, closing, closedAt: Date.now() });
        },
        [session, persist]
    );

    // Recien despues de mostrar el resumen la caja cerrada pasa al historial
    const archiveSession = useCallback((): void => {
        if (session) archiveCashSession(session);

        persist(null);
    }, [session, persist]);

    return {
        session,
        isSessionOpen: session !== null && session.closedAt === undefined,
        openSession,
        addMovement,
        removeMovement,
        closeSession,
        archiveSession
    };
};
