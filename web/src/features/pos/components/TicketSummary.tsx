import type { TicketTotals } from "../posOperations";
import { formatPrice } from "../../../shared/helpers/formatPrice";

interface TicketSummaryProps {
    totals: TicketTotals;
}

export const TicketSummary = ({ totals }: TicketSummaryProps) => (
    <div className="flex-1 space-y-3 px-6 py-5 text-sm">
        <div className="flex justify-between text-slate-600">
            <span>Subtotal</span>
            <span className="tabular-nums">{formatPrice(totals.subtotal)}</span>
        </div>
        <div className="flex justify-between text-slate-600">
            <span>Promociones</span>
            <span className="tabular-nums text-emerald-700">-{formatPrice(totals.discount)}</span>
        </div>
    </div>
);
