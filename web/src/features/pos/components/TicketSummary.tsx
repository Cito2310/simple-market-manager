import type { TicketTotals } from "../posOperations";
import { formatPrice } from "../../../shared/helpers/formatPrice";

interface TicketSummaryProps {
    totals: TicketTotals;
    canCheckout: boolean;
    onCheckout: () => void;
}

export const TicketSummary = ({ totals, canCheckout, onCheckout }: TicketSummaryProps) => (
    <aside className="flex w-80 shrink-0 flex-col border-l border-slate-200 bg-white">
        <header className="border-b border-slate-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-slate-900">Ticket</h2>
            <span className="text-sm text-slate-500">Sin numero hasta cobrar</span>
        </header>

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

        {/* El boton queda pegado abajo de todo, es la accion de la caja */}
        <footer className="border-t border-slate-200 px-6 py-5">
            <div className="mb-4 flex items-baseline justify-between">
                <span className="text-sm font-medium text-slate-500">TOTAL</span>
                <span className="text-3xl font-semibold tabular-nums text-slate-900">
                    {formatPrice(totals.total)}
                </span>
            </div>
            <button
                type="button"
                onClick={onCheckout}
                disabled={!canCheckout}
                className="w-full rounded-lg bg-emerald-600 px-4 py-4 text-base font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
                Cobrar
            </button>
        </footer>
    </aside>
);
