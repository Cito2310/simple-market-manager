import type { TicketTotals } from "../posOperations";
import type { BarcodeScannerState } from "../hooks/useBarcodeScanner";
import type { CashPaymentState } from "../hooks/useCashPayment";
import { PosActions } from "./PosActions";
import { TicketCheckout } from "./TicketCheckout";
import { TicketSummary } from "./TicketSummary";

interface PosSidebarProps {
    ticketCount: number;
    totals: TicketTotals;
    barcode: BarcodeScannerState;
    cash: CashPaymentState;
    onSearch: () => void;
    onCash: () => void;
    onTickets: () => void;
    onCancelSale: () => void;
    onCheckout: () => void;
}

export const PosSidebar = ({
    ticketCount,
    totals,
    barcode,
    cash,
    onSearch,
    onCash,
    onTickets,
    onCancelSale,
    onCheckout
}: PosSidebarProps) => (
    <aside className="flex w-80 shrink-0 flex-col border-l border-slate-200 bg-white">
        <header className="flex items-baseline justify-between border-b border-slate-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-slate-900">Ticket</h2>
            <span className="text-sm text-slate-500">
                {ticketCount} {ticketCount === 1 ? "producto" : "productos"}
            </span>
        </header>

        <PosActions
            canCancelSale={ticketCount > 0}
            onSearch={onSearch}
            onCash={onCash}
            onTickets={onTickets}
            onCancelSale={onCancelSale}
        />

        <TicketSummary totals={totals} />

        <TicketCheckout
            total={totals.total}
            canCheckout={ticketCount > 0}
            barcode={barcode}
            cash={cash}
            onCheckout={onCheckout}
        />
    </aside>
);
