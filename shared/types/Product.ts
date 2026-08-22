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

// La API devuelve la forma compartida de Product más la version key de Mongo
export type ProductApi = Product & { __v: number };

// Todo lo que la API necesita para crear un producto; del resto se encarga el server
export type ProductInput = Omit<Product, "_id" | "createdAt" | "updatedAt">;
