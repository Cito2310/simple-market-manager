import { useState } from "react";
import type { Section } from "@shared/types/Category";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
    addBrand,
    addSubcategory,
    normalize,
    removeBrand,
    removeSubcategory,
    renameBrand,
    renameSubcategory
} from "../categoryOperations";
import type { ApiCategory } from "../categoryThunks";
import { createCategory, deleteCategory, updateCategory } from "../categoryThunks";

// Provisorio hasta que exista auth y el usuario salga del token
const CURRENT_USER = "web";

export type CategoryLevel = "category" | "subcategory" | "brand";

interface CategoryOptionsContext {
    section: string;
    category: ApiCategory | undefined;
    subcategoryName: string;
}

interface CategoryOptionsHandlers {
    onCreated: (level: CategoryLevel, name: string) => void;
    onRenamed: (level: CategoryLevel, previous: string, next: string) => void;
    onDeleted: (level: CategoryLevel, name: string) => void;
}

export const useCategoryOptions = (
    context: CategoryOptionsContext,
    handlers: CategoryOptionsHandlers
) => {
    const dispatch = useAppDispatch();
    const categories = useAppSelector((state) => state.category.items);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Toda accion comparte el mismo estado de guardado: solo hay un panel abierto a la vez
    const run = async (action: () => Promise<void>): Promise<boolean> => {
        setIsSaving(true);
        setError(null);
        try {
            await action();
            return true;
        } catch (caught) {
            setError(caught instanceof Error ? caught.message : String(caught));
            return false;
        } finally {
            setIsSaving(false);
        }
    };

    // Subcategorias y marcas viven dentro del documento de la categoria, asi que se guardan con un PUT completo
    const saveCategory = async (category: ApiCategory): Promise<void> => {
        await dispatch(updateCategory({ ...category, updatedBy: CURRENT_USER })).unwrap();
    };

    const requireCategory = (): ApiCategory => {
        if (!context.category) {
            throw new Error("Elegi una categoria primero");
        }
        return context.category;
    };

    // Las categorias se editan por nombre porque es lo unico que muestra el desplegable
    const findCategoryByName = (name: string): ApiCategory => {
        const category = categories.find((item) => item.section === context.section && item.name === name);
        if (!category) {
            throw new Error("No se encontro la categoria");
        }
        return category;
    };

    const requireName = (value: string): string => {
        const name = normalize(value);
        if (name === "") {
            throw new Error("Escribi un nombre");
        }
        return name;
    };


    const createOption = (level: CategoryLevel, value: string): Promise<boolean> =>
        run(async () => {
            const name = requireName(value);

            if (level === "category") {
                if (categories.some((item) => item.section === context.section && item.name === name)) {
                    throw new Error("Esa categoria ya existe en la seccion");
                }
                const created = await dispatch(
                    createCategory({
                        section: context.section as Section,
                        name,
                        subcategories: [],
                        active: true,
                        createdBy: CURRENT_USER,
                        updatedBy: CURRENT_USER
                    })
                ).unwrap();
                // Se selecciona el nombre que devolvio el server, no el que se tipeo
                handlers.onCreated("category", created.name);
                return;
            }

            const category = requireCategory();
            if (level === "subcategory") {
                await saveCategory(addSubcategory(category, name));
            } else {
                await saveCategory(addBrand(category, context.subcategoryName, name));
            }
            handlers.onCreated(level, name);
        });


    const renameOption = (level: CategoryLevel, previous: string, value: string): Promise<boolean> =>
        run(async () => {
            const name = requireName(value);
            if (name === previous) {
                return;
            }

            if (level === "category") {
                const category = findCategoryByName(previous);
                if (categories.some((item) => item.section === context.section && item.name === name)) {
                    throw new Error("Esa categoria ya existe en la seccion");
                }
                await saveCategory({ ...category, name });
            } else if (level === "subcategory") {
                await saveCategory(renameSubcategory(requireCategory(), previous, name));
            } else {
                await saveCategory(renameBrand(requireCategory(), context.subcategoryName, previous, name));
            }
            handlers.onRenamed(level, previous, name);
        });


    const deleteOption = (level: CategoryLevel, name: string): Promise<boolean> =>
        run(async () => {
            if (level === "category") {
                await dispatch(deleteCategory(findCategoryByName(name)._id)).unwrap();
            } else if (level === "subcategory") {
                await saveCategory(removeSubcategory(requireCategory(), name));
            } else {
                await saveCategory(removeBrand(requireCategory(), context.subcategoryName, name));
            }
            handlers.onDeleted(level, name);
        });


    return { isSaving, error, createOption, renameOption, deleteOption };
};
