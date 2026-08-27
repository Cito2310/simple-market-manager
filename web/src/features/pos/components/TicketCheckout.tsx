import type { BarcodeScannerState } from "../hooks/useBarcodeScanner";
import type { CashPaymentState } from "../hooks/useCashPayment";
import { SHORTCUT_KEYS } from "../hooks/usePosShortcuts";
import { formatPrice } from "../../../shared/helpers/formatPrice";
import { BarcodeField } from "./BarcodeField";
import { CashChangeInput } from "./CashChangeInput";

interface TicketCheckoutProps {
    total: number;
    canCheckout: boolean;
    barcode: BarcodeScannerState;
    cash: CashPaymentState;
    onCheckout: () => void;
}

// El escaneo y el cobro quedan juntos abajo de todo: son las dos acciones de la caja
export const TicketCheckout = ({
    total,
    canCheckout,
    barcode,
    cash,
    onCheckout
}: TicketCheckoutProps) => (
    <footer className="border-t border-slate-200 px-6 py-5">
        <div className="mb-4 space-y-2">
            <BarcodeField barcode={barcode} />

            <CashChangeInput cash={cash} />
        </div>

        <div className="mb-4 flex items-baseline justify-between">
            <span className="text-sm font-medium text-slate-500">TOTAL</span>
            <span className="text-3xl font-semibold tabular-nums text-slate-900">
                {formatPrice(total)}
            </span>
        </div>

        <button
            type="button"
            onClick={onCheckout}
            disabled={!canCheckout}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-4 text-base font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
            Cobrar
            <span className="text-xs font-medium text-emerald-200">{SHORTCUT_KEYS.checkout}</span>
        </button>
    </footer>
);
