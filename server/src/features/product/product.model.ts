import { Schema, model, Document } from "mongoose";
import type { ProductMongo } from "../../../../shared/types/Product.js";
import { detailsSchema, sellSchema, inventorySchema } from "./product.schemas.js";

export interface IProduct extends Document, ProductMongo {}

const productSchema = new Schema<IProduct>(
    {
        details: { type: detailsSchema, required: true },
        sell: { type: sellSchema, required: true },
        inventory: { type: inventorySchema },
        active: { type: Boolean, default: true },
        createdBy: { type: String, required: true, trim: true, lowercase: true },
        updatedBy: { type: String, required: true, trim: true, lowercase: true }
    },
    { timestamps: true, optimisticConcurrency: true }
);

export const ProductModel = model<IProduct>("Product", productSchema);
