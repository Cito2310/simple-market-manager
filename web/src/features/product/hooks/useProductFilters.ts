import { useMemo, useState } from "react";
import type { ProductApi } from "@shared/types/Product";
import { useAppSelector } from "../../../app/store";
import { normalize } from "../../category/categoryOperations";

export interface ProductFilterValues {
    search: string;
    section: string;
    category: string;
}

const EMPTY_FILTERS: ProductFilterValues = { search: "", section: "", category: "" };

// Se busca por nombre, marca y codigo de barras, para poder encontrar un producto con la pistola
const matchesSearch = (product: ProductApi, search: string): boolean =>
    [product.details.name, product.details.brand, product.details.category, product.details.size, product.details.subcategory, ...product.details.barcodes]
        .join(" ")
        .includes(search);

export const useProductFilters = (products: ProductApi[]) => {
    const categories = useAppSelector((state) => state.category.items);
    const [filters, setFilters] = useState<ProductFilterValues>(EMPTY_FILTERS);

    // El producto guarda el nombre de la categoria, no la seccion: la seccion sale del catalogo
    const categoryOptions = useMemo(
        () =>
            categories
                .filter((category) => filters.section === "" || category.section === filters.section)
                .map((category) => category.name),
        [categories, filters.section]
    );

    const filtered = useMemo(() => {
        const search = normalize(filters.search);
        const sectionCategories = new Set(categoryOptions);

        return products.filter((product) => {
            const { category } = product.details;

            if (filters.category !== "" && category !== filters.category) return false;
            if (filters.section !== "" && !sectionCategories.has(category)) return false;
            return search === "" || matchesSearch(product, search);
        });
    }, [products, filters, categoryOptions]);

    const setSearch = (search: string): void => setFilters((current) => ({ ...current, search }));

    // Al cambiar de seccion la categoria elegida puede quedar huerfana, asi que se limpia
    const setSection = (section: string): void =>
        setFilters((current) => ({
            ...current,
            section,
            category: categories.some(
                (item) => item.name === current.category && (section === "" || item.section === section)
            )
                ? current.category
                : ""
        }));

    const setCategory = (category: string): void => setFilters((current) => ({ ...current, category }));

    return { filters, filtered, categoryOptions, setSearch, setSection, setCategory };
};
