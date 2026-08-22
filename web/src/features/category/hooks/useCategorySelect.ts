import { useMemo, useState } from "react";
import { SECTIONS } from "@shared/types/Category";
import { useAppSelector } from "../../../app/hooks";

export interface CategorySelectValues {
    category: string;
    subcategory: string;
    brand: string;
}

export const useCategorySelect = (
    values: CategorySelectValues,
    onChange: (next: CategorySelectValues) => void
) => {
    const { items: categories, status } = useAppSelector((state) => state.category);


    // SELECTED - Para mostrar las siguientes opciones
    const [selectedSection, setSelectedSection] = useState<string | null>(null);

    const selectedCategory = useMemo(
        () => categories.find((category) => category.name === values.category),
        [categories, values.category]
    );

    const selectedSubcategory = useMemo(
        () => selectedCategory?.subcategories.find((subcategory) => subcategory.name === values.subcategory),
        [selectedCategory, values.subcategory]
    );

    const selectedBrand = useMemo(
        () => selectedSubcategory?.brands.find((brand) => brand === values.brand),
        [selectedSubcategory, values.brand]
    );


    // Sin una elección explícita el filtro sigue a la categoría seleccionada, así su propia opción queda visible
    const section = selectedSection ?? selectedCategory?.section ?? "";


    // OPTIONS
    const sectionOptions = SECTIONS;

    const categoryOptions = useMemo(
        () => categories.filter((category) => category.section === section),
        [categories, section]
    );

    const subcategoryOptions = useMemo(
        () => selectedCategory?.subcategories.map((subcategory) => subcategory.name) ?? [],
        [selectedCategory]
    );

    const brandOptions = useMemo(
        () => selectedSubcategory?.brands ?? [],
        [selectedSubcategory]
    );


    // Los valores que ya no están en el catálogo igual se renderizan, para no perderlos en silencio
    const isOrphanCategory = values.category !== "" && categories.length > 0 && selectedCategory === undefined;
    const isOrphanSubcategory = values.subcategory !== "" && selectedCategory !== undefined && selectedSubcategory === undefined;
    const isOrphanBrand = values.brand !== "" && selectedSubcategory !== undefined && selectedBrand === undefined;


    // Cada nivel limpia los de abajo: una marca de otra subcategoría no significaría nada
    const handleSectionChange = (next: string): void => {
        setSelectedSection(next);
        onChange({ category: "", subcategory: "", brand: "" });
    };

    const handleCategoryChange = (next: string): void => {
        onChange({ category: next, subcategory: "", brand: "" });
    };

    const handleSubcategoryChange = (next: string): void => {
        onChange({ category: values.category, subcategory: next, brand: "" });
    };

    const handleBrandChange = (next: string): void => {
        onChange({ category: values.category, subcategory: values.subcategory, brand: next });
    };


    return {
        isLoading: status === "loading",
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
    };
};
