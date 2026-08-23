import { PAGE_SIZES } from "../hooks/useProductPagination";

interface props {
    page: number;
    totalPages: number;
    pageSize: number;
    firstShown: number;
    lastShown: number;
    total: number;
    setPageSize: (size: number) => void;
    goToPrevious: () => void;
    goToNext: () => void;
}

const stepClass =
    "rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:border-slate-200 disabled:text-slate-300 disabled:hover:bg-transparent";

export const ProductPagination = ({
    page,
    totalPages,
    pageSize,
    firstShown,
    lastShown,
    total,
    setPageSize,
    goToPrevious,
    goToNext
}: props) => (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500">
        <span>
            Mostrando {firstShown}-{lastShown} de {total}
        </span>

        <div className="flex items-center gap-3">
            <select
                value={pageSize}
                onChange={(event) => setPageSize(Number(event.target.value))}
                className="rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm text-slate-700 outline-none focus:border-slate-500"
            >
                {PAGE_SIZES.map((size) => (
                    <option key={size} value={size}>{size} por pagina</option>
                ))}
            </select>

            <button type="button" onClick={goToPrevious} disabled={page === 1} className={stepClass}>
                Anterior
            </button>
            <span className="text-slate-600">
                {page} / {totalPages}
            </span>
            <button type="button" onClick={goToNext} disabled={page === totalPages} className={stepClass}>
                Siguiente
            </button>
        </div>
    </div>
);
