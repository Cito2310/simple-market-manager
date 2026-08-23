import { useFieldArray, useWatch } from "react-hook-form";
import type { Control } from "react-hook-form";
import type { ProductFormValues } from "./useProductForm";

export const useProductBatches = (control: Control<ProductFormValues>) => {
    const { fields, append, remove } = useFieldArray({ control, name: "batches" });
    const values = useWatch({ control, name: "batches" });

    // El receivedAt queda vacio a proposito: lo completa el submit con la fecha real de carga
    const addBatch = (): void =>
        append({ batchId: "", quantity: "0", expirationDate: "", noExpiration: false, receivedAt: "" });

    const removeBatch = (index: number): void => remove(index);

    const hasNoExpiration = (index: number): boolean => values?.[index]?.noExpiration ?? false;

    // Un producto que no vence no necesita lotes separados: no hay fecha por la cual distinguirlos.
    // Por eso las dos cosas se excluyen entre si.
    const canAddBatch = !(values ?? []).some((batch) => batch.noExpiration);

    const canSetNoExpiration = fields.length <= 1;

    return { fields, addBatch, removeBatch, hasNoExpiration, canAddBatch, canSetNoExpiration };
};
