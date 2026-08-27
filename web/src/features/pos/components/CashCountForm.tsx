import type { ReactNode } from "react";
import { CASH_DENOMINATIONS } from "@shared/types/CashSession";
import { formatPrice } from "../../../shared/helpers/formatPrice";
import type { CashCountState } from "../hooks/useCashCount";

interface CashCountFormProps {
    count: CashCountState;
    hint?: ReactNode;
}

const inputClass =
    "w-20 rounded-md border border-slate-300 px-2 py-1.5 text-right text-sm tabular-nums text-slate-900 outline-none transition focus:border-slate-500";

export const CashCountForm = ({ count, hint }: CashCountFormProps) => (
    <div className="px-6 py-5">
        {hint && (
            <p className="mb-4 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600">
                {hint}
            </p>
        )}

        <table className="w-full text-sm">
            <tbody className="divide-y divide-slate-100">
                {CASH_DENOMINATIONS.map((denomination) => (
                    <tr key={denomination}>
                        <td className="py-2 tabular-nums text-slate-600">{formatPrice(denomination)}</td>
                        <td className="py-2 text-center">
                            <input
                                value={count.quantities[denomination] ?? ""}
                                onChange={(event) => count.setQuantity(denomination, event.target.value)}
                                inputMode="numeric"
                                autoComplete="off"
                                placeholder="0"
                                className={inputClass}
                            />
                        </td>
                        <td className="py-2 text-right tabular-nums text-slate-500">
                            {formatPrice(denomination * count.quantityOf(denomination))}
                        </td>
                    </tr>
                ))}

                <tr>
                    <td className="py-2 text-slate-600">Monedas</td>
                    <td className="py-2 text-center">
                        <input
                            value={count.coins}
                            onChange={(event) => count.setCoins(event.target.value)}
                            inputMode="decimal"
                            autoComplete="off"
                            placeholder="0"
                            className={inputClass}
                        />
                    </td>
                    <td className="py-2 text-right tabular-nums text-slate-500">
                        {formatPrice(count.coinsAmount)}
                    </td>
                </tr>
            </tbody>
        </table>

        <div className="mt-4 flex items-baseline justify-between border-t border-slate-200 pt-4">
            <span className="text-sm font-medium text-slate-500">TOTAL CONTADO</span>
            <span className="text-2xl font-semibold tabular-nums text-slate-900">
                {formatPrice(count.total)}
            </span>
        </div>
    </div>
);
