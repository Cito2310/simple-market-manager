import { useFieldArray } from "react-hook-form";
import type { Control } from "react-hook-form";
import type { ProductFormValues } from "./useProductForm";

export const useProductBarcodes = (control: Control<ProductFormValues>) => {
    const { fields, append, remove } = useFieldArray({ control, name: "barcodes" });

    // Escribir en la ultima fila abre otra vacia, para escanear en cadena sin tocar el mouse.
    // El shouldFocus va en false porque el cursor tiene que quedarse donde se esta tipeando.
    const handleChange = (index: number, value: string): void => {
        if (index === fields.length - 1 && value.trim() !== "") {
            append({ value: "" }, { shouldFocus: false });
        }
    };

    const removeBarcode = (index: number): void => remove(index);

    // La fila nunca se puede borrar si es la unica: el formulario siempre muestra un campo
    const canRemove = fields.length > 1;

    return { fields, handleChange, removeBarcode, canRemove };
};
