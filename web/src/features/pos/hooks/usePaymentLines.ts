import { useCallback, useState } from "react";
import { PAYMENT_METHODS } from "@shared/types/Ticket";
import type { Payment, PaymentMethod } from "@shared/types/Ticket";
import { parseAmount } from "../../../shared/helpers/parseAmount";

export interface PaymentDraft {
    _id: string;
    method: PaymentMethod;
    amount: string;
    detail: string;
}

const roundAmount = (value: number): number => Math.round(value * 100) / 100;

const buildDraft = (method: PaymentMethod, amount: number): PaymentDraft => ({
    _id: crypto.randomUUID(),
    method,
    amount: amount > 0 ? String(amount) : "",
    detail: ""
});

const paidTotal = (drafts: PaymentDraft[]): number =>
    roundAmount(drafts.reduce((total, draft) => total + parseAmount(draft.amount), 0));

// Al partir el pago casi nunca se repite el medio: se propone el primero que no este usado
const nextMethod = (drafts: PaymentDraft[]): PaymentMethod =>
    PAYMENT_METHODS.find((method) => !drafts.some((draft) => draft.method === method)) ?? "cash";

// La venta arranca con una sola linea en efectivo por el total, que es el caso comun
export const usePaymentLines = (total: number) => {
    const [payments, setPayments] = useState<PaymentDraft[]>(() => [buildDraft("cash", total)]);

    const addPayment = useCallback((): void => {
        setPayments((current) => [
            ...current,
            buildDraft(nextMethod(current), roundAmount(total - paidTotal(current)))
        ]);
    }, [total]);

    const removePayment = useCallback((paymentId: string): void => {
        setPayments((current) => current.filter((payment) => payment._id !== paymentId));
    }, []);

    const updatePayment = useCallback((paymentId: string, changes: Partial<PaymentDraft>): void => {
        setPayments((current) =>
            current.map((payment) => (payment._id === paymentId ? { ...payment, ...changes } : payment))
        );
    }, []);

    const paid = paidTotal(payments);
    const remaining = roundAmount(total - paid);

    // Las lineas en cero se descartan: no aportan nada al ticket
    const toPayments = useCallback(
        (): Payment[] =>
            payments
                .filter((payment) => parseAmount(payment.amount) > 0)
                .map((payment) => ({
                    method: payment.method,
                    amount: parseAmount(payment.amount),
                    detail: payment.detail.trim() || undefined
                })),
        [payments]
    );

    return {
        payments,
        paid,
        remaining,
        isValid: remaining === 0 && paid > 0,
        addPayment,
        removePayment,
        updatePayment,
        toPayments
    };
};

export type PaymentLinesState = ReturnType<typeof usePaymentLines>;
