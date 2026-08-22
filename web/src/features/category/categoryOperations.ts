import type { Subcategory } from "@shared/types/Category";
import type { CategoryApi } from "@shared/types/Category";

// El server guarda todo en minusculas, asi que comparamos y creamos con la misma regla
export const normalize = (value: string): string => value.trim().toLowerCase();

const findSubcategory = (category: CategoryApi, name: string): Subcategory => {
    const subcategory = category.subcategories.find((item) => item.name === name);
    if (!subcategory) {
        throw new Error("No se encontro la subcategoria");
    }
    return subcategory;
};

// Reemplaza una subcategoria dejando intactas las demas
const mapSubcategory = (
    category: CategoryApi,
    name: string,
    replace: (subcategory: Subcategory) => Subcategory
): CategoryApi => ({
    ...category,
    subcategories: category.subcategories.map((item) => (item.name === name ? replace(item) : item))
});


// SUBCATEGORIAS
export const addSubcategory = (category: CategoryApi, name: string): CategoryApi => {
    if (category.subcategories.some((item) => item.name === name)) {
        throw new Error("Esa subcategoria ya existe");
    }
    return { ...category, subcategories: [...category.subcategories, { name, brands: [] }] };
};

export const renameSubcategory = (category: CategoryApi, previous: string, next: string): CategoryApi => {
    findSubcategory(category, previous);
    if (category.subcategories.some((item) => item.name === next)) {
        throw new Error("Esa subcategoria ya existe");
    }
    return mapSubcategory(category, previous, (subcategory) => ({ ...subcategory, name: next }));
};

export const removeSubcategory = (category: CategoryApi, name: string): CategoryApi => ({
    ...category,
    subcategories: category.subcategories.filter((item) => item.name !== name)
});


// MARCAS
export const addBrand = (category: CategoryApi, subcategoryName: string, name: string): CategoryApi => {
    const subcategory = findSubcategory(category, subcategoryName);
    if (subcategory.brands.includes(name)) {
        throw new Error("Esa marca ya existe en la subcategoria");
    }
    return mapSubcategory(category, subcategoryName, (item) => ({ ...item, brands: [...item.brands, name] }));
};

export const renameBrand = (
    category: CategoryApi,
    subcategoryName: string,
    previous: string,
    next: string
): CategoryApi => {
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

export const removeBrand = (category: CategoryApi, subcategoryName: string, name: string): CategoryApi => {
    findSubcategory(category, subcategoryName);
    return mapSubcategory(category, subcategoryName, (item) => ({
        ...item,
        brands: item.brands.filter((brand) => brand !== name)
    }));
};
