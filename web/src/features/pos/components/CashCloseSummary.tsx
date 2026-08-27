import type { CashSession } from "@shared/types/CashSession";
import { formatPrice } from "../../../shared/helpers/formatPrice";
import { countedAtClose, expectedCash, totalByType } from "../cashOperations";

interface CashCloseSummaryProps {
    session: CashSession;
    cashSales: number;
}

const Row = ({ label, value, sign = "" }: { label: string; value: number; sign?: string }) => (
    <div className="flex justify-between text-sm text-slate-600">
        <span>{label}</span>
        <span className="tabular-nums">
            {sign}
            {formatPrice(value)}
        </span>
    </div>
);

export const CashCloseSummary = ({ session, cashSales }: CashCloseSummaryProps) => {
    const expected = expectedCash(session, cashSales);
    const counted = countedAtClose(session);
    const difference = Math.round((counted - expected) * 100) / 100;

    const differenceLabel =
        difference === 0 ? "Sin diferencia" : difference > 0 ? "Sobrante" : "Faltante";
    const differenceColor =
        difference === 0 ? "text-slate-900" : difference > 0 ? "text-emerald-700" : "text-red-600";

    return (
        <div className="space-y-5 px-6 py-5">
            <div className="space-y-2">
                <Row label="Apertura" value={session.opening.total} />
                <Row label="Ventas en efectivo" value={cashSales} sign="+" />
                <Row label="Ingresos" value={totalByType(session.movements, "deposit")} sign="+" />
                <Row label="Retiros" value={totalByType(session.movements, "withdraw")} sign="-" />

                <div className="flex justify-between border-t border-slate-200 pt-2 text-sm font-medium text-slate-700">
                    <span>Esperado</span>
                    <span className="tabular-nums">{formatPrice(expected)}</span>
                </div>
            </div>

            <div className="space-y-2">
                <Row label="Suelto contado" value={session.closing?.total ?? 0} />
                <Row label="Tacos registrados" value={totalByType(session.movements, "bundle")} sign="+" />

                <div className="flex justify-between border-t border-slate-200 pt-2 text-sm font-medium text-slate-700">
                    <span>Contado</span>
                    <span className="tabular-nums">{formatPrice(counted)}</span>
                </div>
            </div>

            <div className="flex items-baseline justify-between border-t border-slate-200 pt-4">
                <span className="text-sm font-medium uppercase text-slate-500">{differenceLabel}</span>
                <span className={`text-3xl font-semibold tabular-nums ${differenceColor}`}>
                    {formatPrice(Math.abs(difference))}
                </span>
            </div>
        </div>
    );
};
