import { Schema, model, Document, HydratedDocument } from "mongoose";
import { SECTIONS } from "../../../../shared/types/Category.js";
import type { CategoryMongo, Subcategory } from "../../../../shared/types/Category.js";

export type CategoryDocument = HydratedDocument<CategoryMongo>;


const subcategorySchema = new Schema<Subcategory>(
    {
        name: { type: String, required: true, trim: true },
        brands: { type: [String], default: [] }
    },
    { _id: false }
);

const categorySchema = new Schema<CategoryDocument>(
    {
        section: { type: String, enum: SECTIONS, required: true },
        name: { type: String, required: true, trim: true },
        subcategories: { type: [subcategorySchema], default: [] },
        active: { type: Boolean, default: true },
        createdBy: { type: String, required: true },
        updatedBy: { type: String, required: true }
    },
    { timestamps: true }
);

export const CategoryModel = model("Category", categorySchema);
