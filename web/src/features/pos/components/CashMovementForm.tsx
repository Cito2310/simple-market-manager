import { CASH_DENOMINATIONS } from "@shared/types/CashSession";
import type { CashMovementType } from "@shared/types/CashSession";
import { formatPrice } from "../../../shared/helpers/formatPrice";
import type { CashMovementFormState } from "../hooks/useCashMovementForm";

interface CashMovementFormProps {
    type: CashMovementType;
    form: CashMovementFormState;
    amount: number;
}

const HINTS: Record<CashMovementType, string> = {
    bundle: "El taco queda contado y sigue en la caja: al cerrar solo contas el efectivo suelto.",
    deposit: "Plata que entra a la caja y no viene de una venta.",
    withdraw: "Plata que sale de la caja. El motivo queda registrado."
};

const fieldClass =
    "w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-500";

export const CashMovementForm = ({ type, form, amount }: CashMovementFormProps) => (
    <div className="space-y-4 px-6 py-5">
        <p className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600">
            {HINTS[type]}
        </p>

        {type === "bundle" ? (
            <div className="flex gap-3">
                <label className="flex-1 text-sm text-slate-600">
                    Billete
                    <select
                        value={form.denomination}
                        onChange={(event) => form.setDenomination(event.target.value)}
                        className={`${fieldClass} mt-1 bg-white`}
                    >
                        {CASH_DENOMINATIONS.map((denomination) => (
                            <option key={denomination} value={denomination}>
                                {formatPrice(denomination)}
                            </option>
                        ))}
                    </select>
                </label>

                <label className="flex-1 text-sm text-slate-600">
                    Cantidad
                    <input
                        value={form.quantity}
                        onChange={(event) => form.setQuantity(event.target.value)}
                        inputMode="numeric"
                        autoComplete="off"
                        autoFocus
                        placeholder="0"
                        className={`${fieldClass} mt-1 tabular-nums`}
                    />
                </label>
            </div>
        ) : (
            <label className="block text-sm text-slate-600">
                Monto
                <input
                    value={form.amount}
                    onChange={(event) => form.setAmount(event.target.value)}
                    inputMode="decimal"
                    autoComplete="off"
                    autoFocus
                    placeholder="0"
                    className={`${fieldClass} mt-1 tabular-nums`}
                />
            </label>
        )}

        <label className="block text-sm text-slate-600">
            Motivo {type !== "withdraw" && <span className="text-slate-400">(opcional)</span>}
            <input
                value={form.note}
                onChange={(event) => form.setNote(event.target.value)}
                autoComplete="off"
                placeholder={type === "withdraw" ? "Pago a proveedor, retiro a caja fuerte..." : "Nota"}
                className={`${fieldClass} mt-1`}
            />
        </label>

        <div className="flex items-baseline justify-between border-t border-slate-200 pt-4">
            <span className="text-sm font-medium text-slate-500">MONTO</span>
            <span className="text-2xl font-semibold tabular-nums text-slate-900">
                {formatPrice(amount)}
            </span>
        </div>
    </div>
);
