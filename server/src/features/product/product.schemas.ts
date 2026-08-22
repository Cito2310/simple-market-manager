import { Schema } from "mongoose";
import { SIZE_UNITS } from "../../../../shared/types/Product.js";
import type { Promotion, Batch, Details, Sell, Inventory } from "../../../../shared/types/Product.js";

export const promotionSchema = new Schema<Promotion>(
    {
        minQuantity: { type: Number, required: true, min: 1 },
        pricePerUnit: { type: Number, required: true, min: 0 }
    },
    { _id: false }
);

export const batchSchema = new Schema<Batch>({
    quantity: { type: Number, required: true, min: 0 },
    expirationDate: { type: Date },
    receivedAt: { type: Date, default: Date.now }
});

export const detailsSchema = new Schema<Details>(
    {
        name: { type: String, required: true, trim: true, lowercase: true },
        brand: { type: String, required: true, trim: true, lowercase: true },
        category: { type: String, required: true, trim: true, lowercase: true },
        subcategory: { type: String, required: true, trim: true, lowercase: true },
        barcodes: { type: [{ type: String, trim: true, lowercase: true }], default: [] },
        size: { type: Number, required: true, min: 0 },
        sizeUnit: { type: String, enum: SIZE_UNITS, required: true, trim: true, lowercase: true }
    },
    { _id: false }
);

export const sellSchema = new Schema<Sell>(
    {
        cost: { type: Number, required: true, min: 0 },
        salePrice: { type: Number, required: true, min: 0 },
        promotions: { type: [promotionSchema], default: [] },
        weighable: { type: Boolean, default: false }
    },
    { _id: false }
);

export const inventoryAlertsSchema = new Schema<Inventory["alerts"]>(
    {
        enabled: { type: Boolean, default: false },
        warning: { type: Number, default: 0, min: 0 },
        low: { type: Number, default: 0, min: 0 },
        critical: { type: Number, default: 0, min: 0 }
    },
    { _id: false }
);

export const inventorySchema = new Schema<Inventory>(
    {
        batches: { type: [batchSchema], default: [] },
        alerts: { type: inventoryAlertsSchema, required: true }
    },
    { _id: false }
);
