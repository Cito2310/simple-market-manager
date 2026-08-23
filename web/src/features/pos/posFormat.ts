import type { SizeUnit } from "@shared/types/Product";

// Las unidades sueltas se muestran peladas; los pesables llevan su unidad al lado
export const formatQuantity = (quantity: number, sizeUnit: SizeUnit): string =>
    sizeUnit === "unit" ? String(quantity) : `${quantity} ${sizeUnit}`;
