import type { Auditable } from "./Auditable.js";

export const SECTIONS = [
    "almacén",
    "limpieza",
    "perfumería",
    "lácteos",
    "bebidas",
    "congelados",
    "bazar",
    "pollería",
    "fiambrería",
] as const;

export type Section = (typeof SECTIONS)[number];


export interface Subcategory {
    name: string;
    brands: string[];
}


export interface Category extends Auditable {
    _id: string;
    section: Section;
    name: string;
    subcategories: Subcategory[];
    active: boolean;
}


export type CategoryMongo = Omit<Category, "_id">;