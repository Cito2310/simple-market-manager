import type { ProductApi } from "@shared/types/Product";

// Debajo de este umbral el vencimiento se marca en rojo
export const NEAR_EXPIRATION_DAYS = 30;

export interface ProductExpiration {
    text: string;
    isUrgent: boolean;
}

const MS_PER_DAY = 24 * 60 * 60 * 1000;

const startOfDay = (value: Date): number =>
    new Date(value.getFullYear(), value.getMonth(), value.getDate()).getTime();

// Se compara a nivel de dia: la hora que traiga la fecha no tiene que mover la cuenta
const daysUntil = (date: Date): number => Math.round((startOfDay(date) - startOfDay(new Date())) / MS_PER_DAY);

// De todos los lotes, el que vence primero: es el que hay que vender antes (FEFO)
const nextExpiration = (product: ProductApi): Date | undefined => {
    const times = (product.inventory?.batches ?? [])
        .filter((batch) => batch.expirationDate !== undefined)
        .map((batch) => new Date(batch.expirationDate as Date).getTime());

    return times.length === 0 ? undefined : new Date(Math.min(...times));
};

const dayLabel = (days: number): string => (Math.abs(days) === 1 ? "día" : "días");

const toText = (days: number): string => {
    if (days < 0) return `Vencido hace ${Math.abs(days)} ${dayLabel(days)}`;
    if (days === 0) return "Vence hoy";
    return `Vence en ${days} ${dayLabel(days)}`;
};

export const formatProductExpiration = (product: ProductApi): ProductExpiration => {
    const date = nextExpiration(product);

    // Sin lotes con fecha no hay nada que avisar: puede no vencer o no tener stock cargado
    if (date === undefined) return { text: "—", isUrgent: false };

    const days = daysUntil(date);

    return { text: toText(days), isUrgent: days < NEAR_EXPIRATION_DAYS };
};
