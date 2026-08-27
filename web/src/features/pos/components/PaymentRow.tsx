import { PAYMENT_METHODS } from "@shared/types/Ticket";
import type { PaymentMethod } from "@shared/types/Ticket";
import type { PaymentDraft } from "../hooks/usePaymentLines";
import { PAYMENT_METHOD_LABELS } from "../posFormat";

interface PaymentRowProps {
    payment: PaymentDraft;
    canRemove: boolean;
    onChange: (changes: Partial<PaymentDraft>) => void;
    onRemove: () => void;
}

const fieldClass =
    "rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-500";

export const PaymentRow = ({ payment, canRemove, onChange, onRemove }: PaymentRowProps) => (
    <div className="flex flex-wrap items-center gap-2">
        <select
            value={payment.method}
            onChange={(event) => onChange({ method: event.target.value as PaymentMethod })}
            className={`${fieldClass} w-40 bg-white`}
        >
            {PAYMENT_METHODS.map((method) => (
                <option key={method} value={method}>
                    {PAYMENT_METHOD_LABELS[method]}
                </option>
            ))}
        </select>

        <input
            value={payment.amount}
            onChange={(event) => onChange({ amount: event.target.value })}
            inputMode="decimal"
            autoComplete="off"
            placeholder="0"
            className={`${fieldClass} w-32 text-right tabular-nums`}
        />

        {/* El detalle es texto libre por ahora: la lista fija de cuentas esta en el backlog */}
        {payment.method !== "cash" && (
            <input
                value={payment.detail}
                onChange={(event) => onChange({ detail: event.target.value })}
                autoComplete="off"
                placeholder="Cuenta o banco (opcional)"
                className={`${fieldClass} min-w-40 flex-1`}
            />
        )}

        <button
            type="button"
            onClick={onRemove}
            disabled={!canRemove}
            aria-label="Quitar medio de pago"
            className="ml-auto rounded px-2 py-1 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:invisible"
        >
            Quitar
        </button>
    </div>
);
