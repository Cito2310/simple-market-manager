import type { Ticket } from "@shared/types/Ticket";
import { formatPrice } from "../../../shared/helpers/formatPrice";
import { formatPaymentMethods, formatTicketDateTime } from "../posFormat";

interface TicketListProps {
    tickets: Ticket[];
    onSelect: (ticket: Ticket) => void;
}

const itemsLabel = (ticket: Ticket): string =>
    `${ticket.lines.length} ${ticket.lines.length === 1 ? "item" : "items"}`;

export const TicketList = ({ tickets, onSelect }: TicketListProps) => {
    if (tickets.length === 0) {
        return <p className="px-6 py-10 text-center text-sm text-slate-400">Todavia no hay ventas</p>;
    }

    return (
        <ul className="divide-y divide-slate-100">
            {tickets.map((ticket) => (
                <li key={ticket._id}>
                    <button
                        type="button"
                        onClick={() => onSelect(ticket)}
                        className="flex w-full items-center gap-4 px-6 py-3 text-left text-sm transition hover:bg-slate-50"
                    >
                        <span className="w-28 shrink-0 tabular-nums text-slate-500">
                            {formatTicketDateTime(ticket.timestamp)}
                        </span>

                        <span className="w-20 shrink-0 text-slate-500">{itemsLabel(ticket)}</span>

                        <span className="min-w-0 flex-1 truncate text-slate-600">
                            {formatPaymentMethods(ticket.payments)}
                        </span>

                        <span className="shrink-0 font-medium tabular-nums text-slate-900">
                            {formatPrice(ticket.total)}
                        </span>
                    </button>
                </li>
            ))}
        </ul>
    );
};
