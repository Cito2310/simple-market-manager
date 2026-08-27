import type { SizeUnit } from "@shared/types/Product";
import type { Payment, PaymentMethod } from "@shared/types/Ticket";

// Los pesables se manejan en kilos, pero en pantalla van en gramos: es lo que imprime la
// balanza y como los nombra el cliente ("300 de pan", no "0,3 de pan")
const SUB_UNITS: Partial<Record<SizeUnit, SizeUnit>> = {
    kg: "g",
    g: "g",
    l: "ml",
    ml: "ml"
};

// Las unidades sueltas se muestran peladas; los pesables llevan su unidad al lado
export const formatQuantity = (quantity: number, sizeUnit: SizeUnit): string => {
    if (sizeUnit === "unit") return String(quantity);

    const subUnit = SUB_UNITS[sizeUnit];

    if (!subUnit) return `${quantity} ${sizeUnit}`;

    return `${Math.round(quantity * 1000)} ${subUnit}`;
};

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
    cash: "Efectivo",
    transfer: "Transferencia",
    debit: "Debito",
    credit: "Credito",
    qr: "QR"
};

export const formatTicketDateTime = (timestamp: number): string =>
    new Date(timestamp).toLocaleString("es-AR", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
    });

// Los medios usados en la venta, sin repetir: "Efectivo, QR"
export const formatPaymentMethods = (payments: Payment[]): string =>
    [...new Set(payments.map((payment) => PAYMENT_METHOD_LABELS[payment.method]))].join(", ");

// El _id es un uuid: en pantalla alcanza con el arranque para identificar el ticket
export const formatTicketNumber = (ticketId: string): string => `#${ticketId.slice(0, 8)}`;
