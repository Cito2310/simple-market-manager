import type { Inventory, ProductApi } from "@shared/types/Product";
import { getProductStock } from "./getProductStock";

export type StockTone = "empty" | "critical" | "low" | "warning" | "ok";

export interface ProductStockLevel {
    stock: number;
    percent: number;
    tone: StockTone;
    warning: number;
    // Sin umbral de aviso la barra no significa nada: se muestra solo el numero
    hasThreshold: boolean;
}

// La barra se llena del todo al doble del aviso, asi el aviso queda justo a la mitad
const FULL_BAR_FACTOR = 2;

// Se evalua de lo mas grave a lo menos: sin stock gana siempre, aunque los umbrales sean 0
const toTone = (stock: number, alerts: Inventory["alerts"]): StockTone => {
    if (stock <= 0) return "empty";
    if (stock <= alerts.critical) return "critical";
    if (stock <= alerts.low) return "low";
    return stock <= alerts.warning ? "warning" : "ok";
};

export const getProductStockLevel = (product: ProductApi): ProductStockLevel => {
    const stock = getProductStock(product);
    const alerts = product.inventory?.alerts;

    // Sin aviso configurado no hay escala contra la cual medir, asi que tampoco hay colores
    if (alerts === undefined || alerts.warning <= 0) {
        return { stock, percent: 0, tone: "ok", warning: alerts?.warning ?? 0, hasThreshold: false };
    }

    return {
        stock,
        percent: Math.min(100, (stock / (alerts.warning * FULL_BAR_FACTOR)) * 100),
        tone: toTone(stock, alerts),
        warning: alerts.warning,
        hasThreshold: true
    };
};
