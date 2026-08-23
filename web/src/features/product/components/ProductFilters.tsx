import { SECTIONS } from "@shared/types/Category";
import type { ProductFilterValues } from "../hooks/useProductFilters";

interface props {
    filters: ProductFilterValues;
    categoryOptions: string[];
    setSearch: (value: string) => void;
    setSection: (value: string) => void;
    setCategory: (value: string) => void;
}

const selectClass =
    "rounded-md border border-slate-300 bg-white px-3 py-2 text-sm capitalize text-slate-700 outline-none focus:border-slate-500";
const searchClass =
    "min-w-48 flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500";

export const ProductFilters = ({ filters, categoryOptions, setSearch, setSection, setCategory }: props) => (
    <div className="mb-4 flex flex-wrap items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3">
        <input
            className={searchClass}
            placeholder="Buscar por nombre, marca o codigo..."
            value={filters.search}
            onChange={(event) => setSearch(event.target.value)}
        />

        <select
            className={selectClass}
            value={filters.section}
            onChange={(event) => setSection(event.target.value)}
        >
            <option value="">Seccion</option>
            {SECTIONS.map((section) => (
                <option key={section} value={section}>{section}</option>
            ))}
        </select>

        <select
            className={selectClass}
            value={filters.category}
            onChange={(event) => setCategory(event.target.value)}
        >
            <option value="">Categoria</option>
            {categoryOptions.map((category) => (
                <option key={category} value={category}>{category}</option>
            ))}
        </select>
    </div>
);
