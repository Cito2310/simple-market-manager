import { useCallback, useState } from "react";

// El monto se guarda como texto para no pelear con el input mientras se tipea
const parseAmount = (value: string): number | null => {
    const normalized = value.trim().replace(",", ".");

    if (!normalized) return null;

    const amount = Number(normalized);

    return Number.isFinite(amount) ? amount : null;
};

// Calculadora de vuelto: no toca el ticket, solo ayuda al cajero con la cuenta.
// Un monto negativo se usa para cotizar: dice cuanto quedaria el total sumando ese producto
export const useCashPayment = (total: number) => {
    const [value, setValue] = useState("");

    const changeValue = useCallback((next: string): void => setValue(next), []);

    const reset = useCallback((): void => setValue(""), []);

    const received = parseAmount(value);
    const change = received === null ? null : Math.round((received - total) * 100) / 100;

    return { value, received, change, changeValue, reset };
};

export type CashPaymentState = ReturnType<typeof useCashPayment>;
