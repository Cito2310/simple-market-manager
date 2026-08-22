import type { Subcategory } from "@shared/types/Category";
import type { ApiCategory } from "./categoryThunks";

// El server guarda todo en minusculas, asi que comparamos y creamos con la misma regla
export const normalize = (value: string): string => value.trim().toLowerCase();

const findSubcategory = (category: ApiCategory, name: string): Subcategory => {
    const subcategory = category.subcategories.find((item) => item.name === name);
    if (!subcategory) {
        throw new Error("No se encontro la subcategoria");
    }
    return subcategory;
};

// Reemplaza una subcategoria dejando intactas las demas
const mapSubcategory = (
    category: ApiCategory,
    name: string,
    replace: (subcategory: Subcategory) => Subcategory
): ApiCategory => ({
    ...category,
    subcategories: category.subcategories.map((item) => (item.name === name ? replace(item) : item))
});


// SUBCATEGORIAS
export const addSubcategory = (category: ApiCategory, name: string): ApiCategory => {
    if (category.subcategories.some((item) => item.name === name)) {
        throw new Error("Esa subcategoria ya existe");
    }
    return { ...category, subcategories: [...category.subcategories, { name, brands: [] }] };
};

export const renameSubcategory = (category: ApiCategory, previous: string, next: string): ApiCategory => {
    findSubcategory(category, previous);
    if (category.subcategories.some((item) => item.name === next)) {
        throw new Error("Esa subcategoria ya existe");
    }
    return mapSubcategory(category, previous, (subcategory) => ({ ...subcategory, name: next }));
};

export const removeSubcategory = (category: ApiCategory, name: string): ApiCategory => ({
    ...category,
    subcategories: category.subcategories.filter((item) => item.name !== name)
});


// MARCAS
export const addBrand = (category: ApiCategory, subcategoryName: string, name: string): ApiCategory => {
    const subcategory = findSubcategory(category, subcategoryName);
    if (subcategory.brands.includes(name)) {
        throw new Error("Esa marca ya existe en la subcategoria");
    }
    return mapSubcategory(category, subcategoryName, (item) => ({ ...item, brands: [...item.brands, name] }));
};

export const renameBrand = (
    category: ApiCategory,
    subcategoryName: string,
    previous: string,
    next: string
): ApiCategory => {
    const subcategory = findSubcategory(category, subcategoryName);
    if (!subcategory.brands.includes(previous)) {
        throw new Error("No se encontro la marca");
    }
    if (subcategory.brands.includes(next)) {
        throw new Error("Esa marca ya existe en la subcategoria");
    }
    return mapSubcategory(category, subcategoryName, (item) => ({
        ...item,
        brands: item.brands.map((brand) => (brand === previous ? next : brand))
    }));
};

export const removeBrand = (category: ApiCategory, subcategoryName: string, name: string): ApiCategory => {
    findSubcategory(category, subcategoryName);
    return mapSubcategory(category, subcategoryName, (item) => ({
        ...item,
        brands: item.brands.filter((brand) => brand !== name)
    }));
};
