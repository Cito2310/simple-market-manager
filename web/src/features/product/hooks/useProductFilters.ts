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

// Sin acentos y en minusculas, para que "cafe" encuentre "café"
const toSearchText = (value: string): string =>
    normalize(value)
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

// Todo lo que describe al producto entra en la busqueda: el tamanio va en sus dos formas
// ("3l" y "3 l") y los codigos de barra permiten encontrarlo con la pistola
const searchableText = (product: ProductApi): string => {
    const { name, brand, category, subcategory, size, sizeUnit, barcodes } = product.details;

    return toSearchText(
        [name, brand, category, subcategory, `${size}${sizeUnit}`, `${size} ${sizeUnit}`, ...barcodes].join(" ")
    );
};

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

    // El texto de cada producto se arma una sola vez, no en cada tecla del buscador
    const searchIndex = useMemo(
        () => products.map((product) => ({ product, text: searchableText(product) })),
        [products]
    );

    const filtered = useMemo(() => {
        // Cada palabra tiene que aparecer en algun lado, sin importar el orden:
        // "gaseosa 3l" encuentra la gaseosa de 3 litros
        const terms = toSearchText(filters.search).split(" ").filter(Boolean);
        const sectionCategories = new Set(categoryOptions);

        return searchIndex
            .filter(({ product, text }) => {
                const { category } = product.details;

                if (filters.category !== "" && category !== filters.category) return false;
                if (filters.section !== "" && !sectionCategories.has(category)) return false;
                return terms.every((term) => text.includes(term));
            })
            .map(({ product }) => product);
    }, [searchIndex, filters, categoryOptions]);

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
