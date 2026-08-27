import type { Ticket } from "@shared/types/Ticket";
import { formatPrice } from "../../../shared/helpers/formatPrice";
import {
    PAYMENT_METHOD_LABELS,
    formatQuantity,
    formatTicketDateTime,
    formatTicketNumber
} from "../posFormat";

interface TicketDetailProps {
    ticket: Ticket;
}

// El subtotal no se guarda en el ticket: se reconstruye desde el precio de lista de cada linea
const ticketSubtotal = (ticket: Ticket): number =>
    Math.round(ticket.lines.reduce((sum, line) => sum + line.quantity * line.unitPrice, 0) * 100) / 100;

export const TicketDetail = ({ ticket }: TicketDetailProps) => {
    const subtotal = ticketSubtotal(ticket);
    const discount = Math.round((subtotal - ticket.total) * 100) / 100;

    return (
        <div className="space-y-5 px-6 py-5">
            <div className="flex items-baseline justify-between">
                <span className="font-medium tabular-nums text-slate-900">
                    {formatTicketNumber(ticket._id)}
                </span>
                <span className="text-sm text-slate-500">{formatTicketDateTime(ticket.timestamp)}</span>
            </div>

            <ul className="divide-y divide-slate-100 border-y border-slate-200 text-sm">
                {ticket.lines.map((line) => (
                    <li key={line.productId} className="flex items-baseline gap-3 py-2">
                        <span className="w-16 shrink-0 tabular-nums text-slate-500">
                            {formatQuantity(line.quantity, line.sizeUnit)}
                        </span>

                        <span className="min-w-0 flex-1">
                            <span className="block truncate capitalize text-slate-700">{line.name}</span>
                            {line.appliedPromotion && (
                                <span className="block text-xs text-emerald-700">
                                    Promo {line.appliedPromotion.minQuantity}x{" "}
                                    {formatPrice(line.appliedPromotion.pricePerUnit)}
                                </span>
                            )}
                        </span>

                        <span className="w-24 shrink-0 text-right tabular-nums text-slate-500">
                            {formatPrice(line.unitPrice)}
                        </span>

                        <span className="w-24 shrink-0 text-right tabular-nums text-slate-900">
                            {formatPrice(line.total)}
                        </span>
                    </li>
                ))}
            </ul>

            <div className="space-y-2 text-sm">
                <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span className="tabular-nums">{formatPrice(subtotal)}</span>
                </div>

                {discount > 0 && (
                    <div className="flex justify-between text-emerald-700">
                        <span>Promociones</span>
                        <span className="tabular-nums">-{formatPrice(discount)}</span>
                    </div>
                )}

                <div className="flex items-baseline justify-between border-t border-slate-200 pt-3">
                    <span className="text-sm font-medium text-slate-500">TOTAL</span>
                    <span className="text-2xl font-semibold tabular-nums text-slate-900">
                        {formatPrice(ticket.total)}
                    </span>
                </div>
            </div>

            <div className="space-y-2 border-t border-slate-200 pt-4">
                <h3 className="text-xs font-medium uppercase tracking-wide text-slate-400">Pagos</h3>

                {ticket.payments.map((payment, index) => (
                    <div key={index} className="flex justify-between text-sm text-slate-600">
                        <span>
                            {PAYMENT_METHOD_LABELS[payment.method]}
                            {payment.detail && <span className="text-slate-400"> · {payment.detail}</span>}
                        </span>
                        <span className="tabular-nums">{formatPrice(payment.amount)}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};
