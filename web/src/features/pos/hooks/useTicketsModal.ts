import { useCallback, useState } from "react";
import type { Ticket } from "@shared/types/Ticket";
import { readRecentTickets } from "../posStorage";

const RECENT_LIMIT = 20;

export const useTicketsModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [selected, setSelected] = useState<Ticket | null>(null);

    // La lista se lee al abrir: asi incluye las ventas hechas desde la ultima vez
    const open = useCallback((): void => {
        setTickets(readRecentTickets(RECENT_LIMIT));
        setSelected(null);
        setIsOpen(true);
    }, []);

    const close = useCallback((): void => setIsOpen(false), []);

    const selectTicket = useCallback((ticket: Ticket): void => setSelected(ticket), []);

    const backToList = useCallback((): void => setSelected(null), []);

    return { isOpen, tickets, selected, open, close, selectTicket, backToList };
};

export type TicketsModalState = ReturnType<typeof useTicketsModal>;
