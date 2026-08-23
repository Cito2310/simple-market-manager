import { useEffect, useState } from "react";

export const PAGE_SIZES = [25, 50, 100];

// resetKey vuelve a la primera pagina cuando cambia el filtro, no cuando cambian los productos:
// asi editar un producto no te saca de la pagina en la que estabas
export const useProductPagination = <T>(items: T[], resetKey: unknown) => {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);

    useEffect(() => setPage(1), [resetKey, pageSize]);

    const totalPages = Math.max(1, Math.ceil(items.length / pageSize));

    // Se recorta por si la lista se achico estando en la ultima pagina (por ejemplo al borrar)
    const currentPage = Math.min(page, totalPages);
    const from = (currentPage - 1) * pageSize;
    const pageItems = items.slice(from, from + pageSize);

    const goToPrevious = (): void => setPage(Math.max(currentPage - 1, 1));

    const goToNext = (): void => setPage(Math.min(currentPage + 1, totalPages));

    return {
        pageItems,
        page: currentPage,
        totalPages,
        pageSize,
        setPageSize,
        goToPrevious,
        goToNext,
        // Rango humano: la primera fila es la 1, no la 0
        firstShown: items.length === 0 ? 0 : from + 1,
        lastShown: from + pageItems.length,
        total: items.length
    };
};
