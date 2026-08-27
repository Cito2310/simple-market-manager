import { useCallback, useRef } from "react";
import type { ProductApi } from "@shared/types/Product";
import { useProducts } from "../../product/hooks/useProducts";
import { useProductFilters } from "../../product/hooks/useProductFilters";

// El catalogo entero son casi dos mil productos: se recorta para no armar una lista gigante
const MAX_RESULTS = 50;

export const useProductSearch = (onSelect: (product: ProductApi) => void) => {
    const { products } = useProducts();
    const { filters, filtered, setSearch } = useProductFilters(products);
    const inputRef = useRef<HTMLInputElement>(null);

    const hasSearch = filters.search.trim() !== "";
    // Sin texto no se lista nada, si no entrarian los 1900 productos de entrada
    const results = hasSearch ? filtered.slice(0, MAX_RESULTS) : [];

    const selectProduct = useCallback(
        (product: ProductApi): void => {
            onSelect(product);
            setSearch("");
            inputRef.current?.focus();
        },
        // setSearch se recrea en cada render de useProductFilters, no aporta como dependencia
        [onSelect] // eslint-disable-line react-hooks/exhaustive-deps
    );

    return {
        inputRef,
        search: filters.search,
        results,
        hasSearch,
        hiddenCount: hasSearch ? filtered.length - results.length : 0,
        changeSearch: setSearch,
        selectProduct
    };
};
