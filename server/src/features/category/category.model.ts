import { Schema, model } from "mongoose";
import type { HydratedDocument } from "mongoose";
import { SECTIONS } from "../../../../shared/types/Category.js";
import type { CategoryMongo, Subcategory } from "../../../../shared/types/Category.js";

// Documento hidratado sobre la forma compartida; el schema se tipa con los datos crudos
export type CategoryDocument = HydratedDocument<CategoryMongo>;

const subcategorySchema = new Schema<Subcategory>(
    {
        name: { type: String, required: true, trim: true, lowercase: true },
        brands: { type: [{ type: String, trim: true, lowercase: true }], default: [] }
    },
    { _id: false }
);

const categorySchema = new Schema<CategoryMongo>(
    {
        section: { type: String, enum: SECTIONS, required: true, trim: true, lowercase: true },
        name: { type: String, required: true, trim: true, lowercase: true },
        subcategories: { type: [subcategorySchema], default: [] },
        active: { type: Boolean, default: true },
        createdBy: { type: String, required: true, trim: true, lowercase: true },
        updatedBy: { type: String, required: true, trim: true, lowercase: true }
    },
    { timestamps: true, optimisticConcurrency: true }
);

export const CategoryModel = model<CategoryMongo>("Category", categorySchema);
