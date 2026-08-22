import type { Promotion, SizeUnit } from "./Product.js";

export const PAYMENT_METHODS = ["cash", "transfer", "debit", "credit", "qr"] as const;

export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export interface Payment {
    method: PaymentMethod;
    detail?: string;
    amount: number;
}

export interface SalesByMethod {
    method: PaymentMethod;
    detail?: string;
    count: number;
    total: number;
}

export interface TicketLine {
    productId: string;
    name: string;
    quantity: number;
    sizeUnit: SizeUnit;
    cost: number;
    unitPrice: number;
    appliedPromotion?: Promotion;
    total: number;
}

export interface Ticket {
    _id: string;
    timestamp: number;
    shiftId: string;
    payments: Payment[];
    lines: TicketLine[];
    total: number;
}
