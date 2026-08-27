import { useCallback, useState } from "react";
import { CASH_DENOMINATIONS } from "@shared/types/CashSession";
import type { CashCountEntry } from "@shared/types/CashSession";
import { countTotal } from "../cashOperations";
import { parseAmount } from "../../../shared/helpers/parseAmount";

type Quantities = Record<number, string>;

// Grilla del arqueo: las cantidades se guardan como texto para no pelear con el input
export const useCashCount = () => {
    const [quantities, setQuantities] = useState<Quantities>({});
    const [coins, setCoins] = useState("");

    const setQuantity = useCallback((denomination: number, value: string): void => {
        setQuantities((current) => ({ ...current, [denomination]: value }));
    }, []);

    const reset = useCallback((): void => {
        setQuantities({});
        setCoins("");
    }, []);

    const quantityOf = (denomination: number): number =>
        Math.floor(parseAmount(quantities[denomination] ?? ""));

    const entries: CashCountEntry[] = CASH_DENOMINATIONS.map((denomination) => ({
        denomination,
        quantity: quantityOf(denomination)
    })).filter((entry) => entry.quantity > 0);

    const coinsAmount = parseAmount(coins);

    return {
        quantities,
        coins,
        entries,
        coinsAmount,
        quantityOf,
        total: countTotal(entries, coinsAmount),
        setQuantity,
        setCoins,
        reset
    };
};

export type CashCountState = ReturnType<typeof useCashCount>;
