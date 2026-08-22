import type { CategorySelectValues } from "../hooks/useCategorySelect";
import { useCategorySelect } from "../hooks/useCategorySelect";

interface CategorySelectProps {
    values: CategorySelectValues;
    onChange: (next: CategorySelectValues) => void;
    categoryError?: string;
    subcategoryError?: string;
    brandError?: string;
}

const fieldClass =
    "w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500 disabled:bg-slate-50 disabled:text-slate-400";
const labelClass = "mb-1 block text-sm font-medium text-slate-700";
const errorClass = "mt-1 text-xs text-red-600";
const hintClass = "mt-1 text-xs text-amber-600";

export const CategorySelect = ({
    values,
    onChange,
    categoryError,
    subcategoryError,
    brandError
}: CategorySelectProps) => {
    const {
        isLoading,
        section,
        sectionOptions,
        categoryOptions,
        subcategoryOptions,
        brandOptions,
        isOrphanCategory,
        isOrphanSubcategory,
        isOrphanBrand,
        handleSectionChange,
        handleCategoryChange,
        handleSubcategoryChange,
        handleBrandChange
    } = useCategorySelect(values, onChange);

    return (
        <>
            <div>
                <label className={labelClass} htmlFor="section">Seccion</label>
                <select
                    id="section"
                    className={fieldClass}
                    value={section}
                    disabled={isLoading}
                    onChange={(event) => handleSectionChange(event.target.value)}
                >
                    <option value="">Elegir seccion</option>
                    {sectionOptions.map((option) => (
                        <option key={option} value={option}>{option}</option>
                    ))}
                </select>
                <p className="mt-1 text-xs text-slate-400">Filtra las categorias, no se guarda</p>
            </div>

            <div>
                <label className={labelClass} htmlFor="category">Categoria</label>
                <select
                    id="category"
                    className={fieldClass}
                    value={values.category}
                    disabled={isLoading || section === ""}
                    onChange={(event) => handleCategoryChange(event.target.value)}
                >
                    <option value="">
                        {isLoading ? "Cargando..." : section === "" ? "Elegi una seccion" : "Elegir categoria"}
                    </option>
                    {isOrphanCategory && <option value={values.category}>{values.category} (no existe)</option>}
                    {categoryOptions.map((option) => (
                        <option key={option._id} value={option.name}>{option.name}</option>
                    ))}
                </select>
                {categoryError && <p className={errorClass}>{categoryError}</p>}
                {isOrphanCategory && <p className={hintClass}>Esta categoria ya no esta en el catalogo</p>}
            </div>

            <div>
                <label className={labelClass} htmlFor="subcategory">Subcategoria</label>
                <select
                    id="subcategory"
                    className={fieldClass}
                    value={values.subcategory}
                    disabled={isLoading || values.category === ""}
                    onChange={(event) => handleSubcategoryChange(event.target.value)}
                >
                    <option value="">{values.category === "" ? "Elegi una categoria" : "Elegir subcategoria"}</option>
                    {isOrphanSubcategory && (
                        <option value={values.subcategory}>{values.subcategory} (fuera de la categoria)</option>
                    )}
                    {subcategoryOptions.map((option) => (
                        <option key={option} value={option}>{option}</option>
                    ))}
                </select>
                {subcategoryError && <p className={errorClass}>{subcategoryError}</p>}
                {isOrphanSubcategory && <p className={hintClass}>No pertenece a la categoria elegida</p>}
            </div>

            <div>
                <label className={labelClass} htmlFor="brand">Marca</label>
                <select
                    id="brand"
                    className={fieldClass}
                    value={values.brand}
                    disabled={isLoading || values.subcategory === ""}
                    onChange={(event) => handleBrandChange(event.target.value)}
                >
                    <option value="">{values.subcategory === "" ? "Elegi una subcategoria" : "Elegir marca"}</option>
                    {isOrphanBrand && <option value={values.brand}>{values.brand} (fuera de la subcategoria)</option>}
                    {brandOptions.map((option) => (
                        <option key={option} value={option}>{option}</option>
                    ))}
                </select>
                {brandError && <p className={errorClass}>{brandError}</p>}
                {isOrphanBrand && <p className={hintClass}>No esta en las marcas de esta subcategoria</p>}
            </div>
        </>
    );
};
