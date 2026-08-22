import type { CategoryLevel } from "../hooks/useCategoryOptions";
import { useCategoryOptions } from "../hooks/useCategoryOptions";
import type { CategorySelectValues } from "../hooks/useCategorySelect";
import { useCategorySelect } from "../hooks/useCategorySelect";
import { SelectField } from "./SelectField";

interface CategoryCascadeProps {
    values: CategorySelectValues;
    onChange: (next: CategorySelectValues) => void;
    categoryError?: string;
    subcategoryError?: string;
    brandError?: string;
}

export const CategoryCascade = ({
    values,
    onChange,
    categoryError,
    subcategoryError,
    brandError
}: CategoryCascadeProps) => {
    const {
        isLoading,
        section,
        selectedCategory,
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

    // Lo recien creado queda seleccionado, reusando la misma cascada que una eleccion normal
    const handleCreated = (level: CategoryLevel, name: string): void => {
        if (level === "category") handleCategoryChange(name);
        if (level === "subcategory") handleSubcategoryChange(name);
        if (level === "brand") handleBrandChange(name);
    };

    // Renombrar no rompe la jerarquia, asi que solo se reemplaza el nivel tocado
    const handleRenamed = (level: CategoryLevel, previous: string, next: string): void => {
        if (level === "category" && values.category === previous) {
            onChange({ ...values, category: next });
        }
        if (level === "subcategory" && values.subcategory === previous) {
            onChange({ ...values, subcategory: next });
        }
        if (level === "brand" && values.brand === previous) {
            onChange({ ...values, brand: next });
        }
    };

    // Borrar el nivel elegido limpia tambien los de abajo
    const handleDeleted = (level: CategoryLevel, name: string): void => {
        if (level === "category" && values.category === name) handleCategoryChange("");
        if (level === "subcategory" && values.subcategory === name) handleSubcategoryChange("");
        if (level === "brand" && values.brand === name) handleBrandChange("");
    };

    const { isSaving, error, createOption, renameOption, deleteOption } = useCategoryOptions(
        { section, category: selectedCategory, subcategoryName: values.subcategory },
        { onCreated: handleCreated, onRenamed: handleRenamed, onDeleted: handleDeleted }
    );

    const categoryNames = categoryOptions.map((option) => option.name);

    return (
        <>
            <div>
                <SelectField
                    id="section"
                    label="Seccion"
                    value={section}
                    placeholder={isLoading ? "Cargando..." : "Elegir seccion"}
                    options={sectionOptions}
                    disabled={isLoading}
                    onSelect={handleSectionChange}
                />
                <p className="mt-1 text-xs text-slate-400">Filtra las categorias, no se guarda</p>
            </div>

            <SelectField
                id="category"
                label="Categoria"
                value={values.category}
                placeholder={section === "" ? "Elegi una seccion" : "Elegir categoria"}
                options={categoryNames}
                orphanLabel={isOrphanCategory ? `${values.category} (no existe)` : undefined}
                disabled={isLoading || section === ""}
                error={categoryError}
                hint={isOrphanCategory ? "Esta categoria ya no esta en el catalogo" : undefined}
                isEditable
                isSaving={isSaving}
                actionError={error}
                onSelect={handleCategoryChange}
                onCreate={(name) => createOption("category", name)}
                onRename={(previous, next) => renameOption("category", previous, next)}
                onDelete={(name) => void deleteOption("category", name)}
            />

            <SelectField
                id="subcategory"
                label="Subcategoria"
                value={values.subcategory}
                placeholder={values.category === "" ? "Elegi una categoria" : "Elegir subcategoria"}
                options={subcategoryOptions}
                orphanLabel={isOrphanSubcategory ? `${values.subcategory} (fuera de la categoria)` : undefined}
                disabled={isLoading || values.category === ""}
                error={subcategoryError}
                hint={isOrphanSubcategory ? "No pertenece a la categoria elegida" : undefined}
                isEditable={selectedCategory !== undefined}
                isSaving={isSaving}
                actionError={error}
                onSelect={handleSubcategoryChange}
                onCreate={(name) => createOption("subcategory", name)}
                onRename={(previous, next) => renameOption("subcategory", previous, next)}
                onDelete={(name) => void deleteOption("subcategory", name)}
            />

            <SelectField
                id="brand"
                label="Marca"
                value={values.brand}
                placeholder={values.subcategory === "" ? "Elegi una subcategoria" : "Elegir marca"}
                options={brandOptions}
                orphanLabel={isOrphanBrand ? `${values.brand} (fuera de la subcategoria)` : undefined}
                disabled={isLoading || values.subcategory === ""}
                error={brandError}
                hint={isOrphanBrand ? "No esta en las marcas de esta subcategoria" : undefined}
                isEditable={values.subcategory !== ""}
                isSaving={isSaving}
                actionError={error}
                onSelect={handleBrandChange}
                onCreate={(name) => createOption("brand", name)}
                onRename={(previous, next) => renameOption("brand", previous, next)}
                onDelete={(name) => void deleteOption("brand", name)}
            />

        </>
    );
};
