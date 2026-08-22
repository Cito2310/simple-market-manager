import type { Ticket } from "@shared/types/Ticket";

const STORAGE_KEY = "smm.tickets";

export const readTickets = (): Ticket[] => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        const parsed: unknown = stored ? JSON.parse(stored) : [];
        return Array.isArray(parsed) ? (parsed as Ticket[]) : [];
    } catch {
        // Si el JSON guardado quedó corrupto se arranca de cero en vez de romper la caja
        return [];
    }
};

export const saveTicket = (ticket: Ticket): void => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...readTickets(), ticket]));
};
