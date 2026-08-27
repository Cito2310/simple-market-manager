import type { CashSession } from "@shared/types/CashSession";

const SESSION_KEY = "smm.cashSession";
const HISTORY_KEY = "smm.cashSessions";

export const readCashSession = (): CashSession | null => {
    try {
        const stored = localStorage.getItem(SESSION_KEY);
        return stored ? (JSON.parse(stored) as CashSession) : null;
    } catch {
        // Si el JSON guardado quedó corrupto se arranca sin caja abierta en vez de romper
        return null;
    }
};

export const saveCashSession = (session: CashSession | null): void => {
    if (!session) {
        localStorage.removeItem(SESSION_KEY);
        return;
    }

    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
};

const readCashHistory = (): CashSession[] => {
    try {
        const stored = localStorage.getItem(HISTORY_KEY);
        const parsed: unknown = stored ? JSON.parse(stored) : [];
        return Array.isArray(parsed) ? (parsed as CashSession[]) : [];
    } catch {
        return [];
    }
};

// Las cajas cerradas quedan guardadas aparte, para los reportes del turno
export const archiveCashSession = (session: CashSession): void => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify([...readCashHistory(), session]));
};
