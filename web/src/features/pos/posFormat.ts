import type { SizeUnit } from "@shared/types/Product";

export const formatPrice = (value: number): string =>
    value.toLocaleString("es-AR", { style: "currency", currency: "ARS" });

// Las unidades sueltas se muestran peladas; los pesables llevan su unidad al lado
export const formatQuantity = (quantity: number, sizeUnit: SizeUnit): string =>
    sizeUnit === "unit" ? String(quantity) : `${quantity} ${sizeUnit}`;
