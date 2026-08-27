import type { CashPaymentState } from "../hooks/useCashPayment";
import { formatPrice } from "../../../shared/helpers/formatPrice";

interface CashChangeInputProps {
    cash: CashPaymentState;
}

// Con un monto negativo la cuenta se lee al reves: es una cotizacion, no una falta de plata
const resultLabel = (received: number, change: number): string => {
    if (received < 0) return "Seria";

    return change < 0 ? "Falta" : "Vuelto";
};

const resultColor = (received: number, change: number): string => {
    if (received < 0) return "text-slate-500";

    return change < 0 ? "text-red-600" : "text-emerald-700";
};

export const CashChangeInput = ({ cash }: CashChangeInputProps) => {
    const { value, received, change, changeValue } = cash;

    return (
        <div>
            <input
                value={value}
                onChange={(event) => changeValue(event.target.value)}
                inputMode="decimal"
                autoComplete="off"
                className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm tabular-nums text-slate-900 outline-none transition focus:border-slate-500 focus:bg-white"
                placeholder="Paga con..."
            />

            {received !== null && change !== null && (
                <p
                    className={`mt-1.5 flex justify-between text-xs font-medium ${resultColor(
                        received,
                        change
                    )}`}
                >
                    <span>{resultLabel(received, change)}</span>
                    <span className="tabular-nums">{formatPrice(Math.abs(change))}</span>
                </p>
            )}
        </div>
    );
};
