import { useEffect, useRef } from "react";

export interface PosShortcutActions {
    onSearch: () => void;
    onCash: () => void;
    onTickets: () => void;
    onManual: () => void;
    // Sin productos en el ticket no hay nada que cancelar ni que cobrar
    onCancelSale?: () => void;
    onCheckout?: () => void;
}

type ActionKey = keyof PosShortcutActions;

const SHORTCUTS: Record<string, ActionKey> = {
    F1: "onSearch",
    F2: "onCash",
    F3: "onTickets",
    F4: "onManual",
    F5: "onCancelSale",
    F9: "onCheckout"
};

export const SHORTCUT_KEYS = {
    search: "F1",
    cash: "F2",
    tickets: "F3",
    manual: "F4",
    cancelSale: "F5",
    checkout: "F9"
} as const;

// Con un modal abierto las acciones no corren, pero la tecla se sigue cortando: un F5 que
// recargue la pagina en el medio de una venta se lleva puesto el ticket
export const usePosShortcuts = (enabled: boolean, actions: PosShortcutActions) => {
    const actionsRef = useRef(actions);
    const enabledRef = useRef(enabled);

    useEffect(() => {
        actionsRef.current = actions;
        enabledRef.current = enabled;
    }, [actions, enabled]);

    useEffect(() => {
        const handleKey = (event: KeyboardEvent): void => {
            const actionKey = SHORTCUTS[event.key];

            if (!actionKey) return;

            event.preventDefault();

            if (!enabledRef.current) return;

            actionsRef.current[actionKey]?.();
        };

        document.addEventListener("keydown", handleKey);

        return () => document.removeEventListener("keydown", handleKey);
    }, []);
};
