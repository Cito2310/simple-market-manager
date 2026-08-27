import { useCallback, useState } from "react";
import { CASH_DENOMINATIONS } from "@shared/types/CashSession";
import { parseAmount } from "../../../shared/helpers/parseAmount";

// Un taco se carga por billete y cantidad; los ingresos y retiros van por monto
export const useCashMovementForm = () => {
    const [denomination, setDenomination] = useState(String(CASH_DENOMINATIONS[3]));
    const [quantity, setQuantity] = useState("");
    const [amount, setAmount] = useState("");
    const [note, setNote] = useState("");

    const reset = useCallback((): void => {
        setQuantity("");
        setAmount("");
        setNote("");
    }, []);

    return {
        denomination,
        quantity,
        amount,
        note,
        bundleAmount: parseAmount(denomination) * Math.floor(parseAmount(quantity)),
        plainAmount: parseAmount(amount),
        setDenomination,
        setQuantity,
        setAmount,
        setNote,
        reset
    };
};

export type CashMovementFormState = ReturnType<typeof useCashMovementForm>;
