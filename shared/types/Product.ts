import type { Auditable } from "./Auditable.js";

// TERTIARY OBJECT
export interface Promotion {
    minQuantity: number;
    pricePerUnit: number;
}

export const SIZE_UNITS = ["unit", "kg", "g", "l", "ml", "m", "oz"] as const;

export type SizeUnit = (typeof SIZE_UNITS)[number];

export interface Batch {
    _id: string;
    quantity: number;
    expirationDate?: Date;
    receivedAt: Date;
}


// SECONDARY OBJECT
export interface Details {
    name: string;
    brand: string;
    section: string;
    category: string;
    subcategory: string;
    barcodes: string[];
    size: number;
    sizeUnit: SizeUnit;
}

export interface Sell {
    cost: number;
    salePrice: number;
    promotions: Promotion[];
    weighable: boolean;
}

export interface Inventory {
    batches: Batch[];
    alerts: {
        enabled: boolean;
        warning: number;
        low: number;
        critical: number;
    };
}


// PRIMARY OBJECT
export interface Product extends Auditable {
    _id: string;
    details: Details;
    sell: Sell;
    inventory?: Inventory;
    active: boolean;
}


export type ProductMongo = Omit<Product, "_id">;