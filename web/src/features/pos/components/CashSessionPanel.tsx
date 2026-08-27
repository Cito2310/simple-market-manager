import type { CashMovementType, CashSession } from "@shared/types/CashSession";
import { formatPrice } from "../../../shared/helpers/formatPrice";
import { expectedCash, totalByType } from "../cashOperations";
import { CashMovementList } from "./CashMovementList";

interface CashSessionPanelProps {
    session: CashSession;
    cashSales: number;
    onMovement: (type: CashMovementType) => void;
    onRemoveMovement: (movementId: string) => void;
    onClose: () => void;
}

const SummaryRow = ({ label, value, sign = "" }: { label: string; value: number; sign?: string }) => (
    <div className="flex justify-between text-sm text-slate-600">
        <span>{label}</span>
        <span className="tabular-nums">
            {sign}
            {formatPrice(value)}
        </span>
    </div>
);

const actionClass =
    "rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50";

const formatDateTime = (timestamp: number): string =>
    new Date(timestamp).toLocaleString("es-AR", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
    });

export const CashSessionPanel = ({
    session,
    cashSales,
    onMovement,
    onRemoveMovement,
    onClose
}: CashSessionPanelProps) => {
    const bundles = totalByType(session.movements, "bundle");

    return (
        <div className="space-y-5 px-6 py-5">
            <p className="text-xs text-slate-500">Caja abierta el {formatDateTime(session.openedAt)}</p>

            <div className="space-y-2">
                <SummaryRow label="Apertura" value={session.opening.total} />
                <SummaryRow label="Ventas en efectivo" value={cashSales} sign="+" />
                <SummaryRow label="Ingresos" value={totalByType(session.movements, "deposit")} sign="+" />
                <SummaryRow label="Retiros" value={totalByType(session.movements, "withdraw")} sign="-" />

                <div className="flex items-baseline justify-between border-t border-slate-200 pt-3">
                    <span className="text-sm font-medium text-slate-500">EFECTIVO ESPERADO</span>
                    <span className="text-2xl font-semibold tabular-nums text-slate-900">
                        {formatPrice(expectedCash(session, cashSales))}
                    </span>
                </div>

                {/* Los tacos no cambian el esperado: son parte de ese efectivo, ya contada */}
                <p className="text-right text-xs text-slate-500">
                    Incluye {formatPrice(bundles)} en tacos ya contados
                </p>
            </div>

            <div className="grid grid-cols-3 gap-2">
                <button type="button" onClick={() => onMovement("bundle")} className={actionClass}>
                    Registrar taco
                </button>
                <button type="button" onClick={() => onMovement("deposit")} className={actionClass}>
                    Ingresar
                </button>
                <button type="button" onClick={() => onMovement("withdraw")} className={actionClass}>
                    Retirar
                </button>
            </div>

            <div className="border-t border-slate-200 pt-2">
                <h3 className="py-2 text-xs font-medium uppercase tracking-wide text-slate-400">
                    Movimientos
                </h3>
                <CashMovementList movements={session.movements} onRemove={onRemoveMovement} />
            </div>

            <button
                type="button"
                onClick={onClose}
                className="w-full rounded-lg border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 transition hover:border-red-300 hover:bg-red-50"
            >
                Cerrar caja
            </button>
        </div>
    );
};
