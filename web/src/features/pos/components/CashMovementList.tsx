import type { CashMovement, CashMovementType } from "@shared/types/CashSession";
import { formatPrice } from "../../../shared/helpers/formatPrice";

interface CashMovementListProps {
    movements: CashMovement[];
    onRemove?: (movementId: string) => void;
}

const MOVEMENT_LABEL: Record<CashMovementType, string> = {
    bundle: "Taco",
    deposit: "Ingreso",
    withdraw: "Retiro"
};

const MOVEMENT_COLOR: Record<CashMovementType, string> = {
    bundle: "text-slate-600",
    deposit: "text-emerald-700",
    withdraw: "text-red-600"
};

const formatTime = (timestamp: number): string =>
    new Date(timestamp).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });

export const CashMovementList = ({ movements, onRemove }: CashMovementListProps) => {
    if (movements.length === 0) {
        return <p className="py-6 text-center text-sm text-slate-400">Sin movimientos todavia</p>;
    }

    return (
        <ul className="divide-y divide-slate-100 text-sm">
            {movements.map((movement) => (
                <li key={movement._id} className="flex items-center gap-3 py-2">
                    <span className="w-20 shrink-0 font-medium text-slate-700">
                        {MOVEMENT_LABEL[movement.type]}
                    </span>

                    <span className="min-w-0 flex-1 truncate text-xs text-slate-500">
                        {formatTime(movement.timestamp)}
                        {movement.note && ` · ${movement.note}`}
                    </span>

                    <span className={`shrink-0 tabular-nums ${MOVEMENT_COLOR[movement.type]}`}>
                        {movement.type === "withdraw" ? "-" : ""}
                        {formatPrice(movement.amount)}
                    </span>

                    {/* Solo los tacos se pueden borrar: si hay que romperlo para dar cambio */}
                    {onRemove && movement.type === "bundle" && (
                        <button
                            type="button"
                            onClick={() => onRemove(movement._id)}
                            className="shrink-0 rounded px-2 py-1 text-xs font-medium text-red-600 transition hover:bg-red-50"
                        >
                            Romper
                        </button>
                    )}
                </li>
            ))}
        </ul>
    );
};
