import { SHORTCUT_KEYS } from "../hooks/usePosShortcuts";

interface PosAction {
    label: string;
    shortcut: string;
    danger?: boolean;
    disabled?: boolean;
    onClick?: () => void;
}

interface PosActionsProps {
    canCancelSale: boolean;
    onSearch: () => void;
    onCash: () => void;
    onTickets: () => void;
    onCancelSale: () => void;
}

const actionClass = (danger?: boolean): string =>
    `flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-white disabled:text-slate-300 ${
        danger
            ? "border-red-200 text-red-600 hover:border-red-300 hover:bg-red-50"
            : "border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50"
    }`;

// Acciones secundarias de la caja, con su tecla de funcion al lado
export const PosActions = ({
    canCancelSale,
    onSearch,
    onCash,
    onTickets,
    onCancelSale
}: PosActionsProps) => {
    const actions: PosAction[] = [
        { label: "Buscar", shortcut: SHORTCUT_KEYS.search, onClick: onSearch },
        { label: "Caja", shortcut: SHORTCUT_KEYS.cash, onClick: onCash },
        { label: "Tickets", shortcut: SHORTCUT_KEYS.tickets, onClick: onTickets },
        {
            label: "Cancelar",
            shortcut: SHORTCUT_KEYS.cancelSale,
            danger: true,
            disabled: !canCancelSale,
            onClick: onCancelSale
        }
    ];

    return (
        <div className="grid grid-cols-2 gap-2 border-b border-slate-200 px-6 py-4">
            {actions.map((action) => (
                <button
                    key={action.label}
                    type="button"
                    onClick={action.onClick}
                    disabled={action.disabled}
                    className={actionClass(action.danger)}
                >
                    {action.label}
                    <span className="text-xs font-normal text-slate-400">{action.shortcut}</span>
                </button>
            ))}
        </div>
    );
};
