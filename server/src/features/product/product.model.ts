import { Schema, model } from "mongoose";
import type { HydratedDocument } from "mongoose";
import type { ProductMongo } from "../../../../shared/types/Product.js";
import { detailsSchema, sellSchema, inventorySchema } from "./product.schemas.js";

// Documento hidratado sobre la forma compartida; el schema se tipa con los datos crudos
export type ProductDocument = HydratedDocument<ProductMongo>;

const productSchema = new Schema<ProductMongo>(
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

export const ProductModel = model<ProductMongo>("Product", productSchema);
