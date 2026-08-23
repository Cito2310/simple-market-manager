import type { TicketLine } from "@shared/types/Ticket";
import { formatPrice } from "../../../shared/helpers/formatPrice";
import { formatQuantity } from "../posFormat";

interface TicketTableProps {
    lines: TicketLine[];
    onRemove: (productId: string) => void;
}

export const TicketTable = ({ lines, onRemove }: TicketTableProps) => (
    <div className="min-h-0 flex-1 overflow-y-auto rounded-lg border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
            <thead className="sticky top-0 border-b border-slate-200 bg-slate-50 text-slate-600">
                <tr>
                    <th className="px-4 py-3 font-medium">Producto</th>
                    <th className="px-4 py-3 text-right font-medium">Cantidad</th>
                    <th className="px-4 py-3 text-right font-medium">Precio unit.</th>
                    <th className="px-4 py-3 text-right font-medium">Total</th>
                    <th className="px-4 py-3" />
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
                {lines.length === 0 && (
                    <tr>
                        <td colSpan={5} className="px-4 py-10 text-center text-slate-400">
                            Escanea un producto para empezar la venta
                        </td>
                    </tr>
                )}
                {lines.map((line) => (
                    <tr key={line.productId} className="text-slate-700">
                        <td className="px-4 py-3">
                            <span className="capitalize">{line.name}</span>
                            {line.appliedPromotion && (
                                <span className="ml-2 rounded bg-emerald-50 px-1.5 py-0.5 text-xs font-medium text-emerald-700">
                                    {line.appliedPromotion.minQuantity}x{" "}
                                    {formatPrice(line.appliedPromotion.pricePerUnit)}
                                </span>
                            )}
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums">
                            {formatQuantity(line.quantity, line.sizeUnit)}
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums">{formatPrice(line.unitPrice)}</td>
                        <td className="px-4 py-3 text-right font-medium tabular-nums text-slate-900">
                            {formatPrice(line.total)}
                        </td>
                        <td className="px-4 py-3 text-right">
                            <button
                                type="button"
                                onClick={() => onRemove(line.productId)}
                                className="rounded px-2 py-1 text-sm font-medium text-red-600 transition hover:bg-red-50 hover:text-red-700"
                            >
                                Quitar
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);
