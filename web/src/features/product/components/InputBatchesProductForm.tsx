import type { Control, FieldErrors, UseFormRegister } from "react-hook-form";
import { useProductBatches } from "../hooks/useProductBatches";
import type { ProductFormValues } from "../hooks/useProductForm";
import { errorClass, fieldClass, labelClass } from "./InputsProductForm";

interface props {
    register: UseFormRegister<ProductFormValues>;
    control: Control<ProductFormValues>;
    errors: FieldErrors<ProductFormValues>;
}

const cellLabelClass = "mb-1 block text-xs font-medium text-slate-500";

// Se muestra sin pasar por Date para no correrse un dia por la zona horaria
const toDisplayDate = (value: string): string => value.split("-").reverse().join("/");

// O tiene fecha de vencimiento, o esta marcado como que no vence: las dos cosas vacias no sirven
const expirationRules = (index: number) => ({
    validate: (value: unknown, values: ProductFormValues) =>
        values.batches[index]?.noExpiration ||
        String(value) !== "" ||
        "Poné la fecha o marcá sin vencimiento"
});

export const InputBatchesProductForm = ({ register, control, errors }: props) => {
    const { fields, addBatch, removeBatch, hasNoExpiration, canAddBatch, canSetNoExpiration } =
        useProductBatches(control);

    return (
        <div className="sm:col-span-2">
            <span className={labelClass}>Lotes</span>

            {fields.length === 0 && (
                <p className="mb-2 text-xs text-slate-400">
                    Sin lotes cargados: el stock de este producto es cero.
                </p>
            )}

            <div className="space-y-3">
                {fields.map((field, index) => (
                    <div key={field.id} className="rounded-md border border-slate-200 p-3">
                        {/* Sin estos dos el valor se pierde al guardar: useFieldArray solo conserva lo registrado */}
                        <input type="hidden" {...register(`batches.${index}.batchId`)} />
                        <input type="hidden" {...register(`batches.${index}.receivedAt`)} />

                        <div className="flex items-end gap-2">
                            <div className="w-24 shrink-0">
                                <label className={cellLabelClass} htmlFor={`batch-quantity-${index}`}>
                                    Cantidad
                                </label>
                                <input
                                    id={`batch-quantity-${index}`}
                                    type="number"
                                    step="any"
                                    className={fieldClass}
                                    {...register(`batches.${index}.quantity`)}
                                />
                            </div>

                            <div className="min-w-0 flex-1">
                                <label className={cellLabelClass} htmlFor={`batch-expiration-${index}`}>
                                    Vence
                                </label>
                                <input
                                    id={`batch-expiration-${index}`}
                                    type="date"
                                    disabled={hasNoExpiration(index)}
                                    className={`${fieldClass} disabled:bg-slate-50 disabled:text-slate-400`}
                                    {...register(`batches.${index}.expirationDate`, expirationRules(index))}
                                />
                            </div>

                            <label
                                className={`flex shrink-0 items-center gap-2 py-2 text-sm ${
                                    canSetNoExpiration || hasNoExpiration(index)
                                        ? "text-slate-700"
                                        : "text-slate-300"
                                }`}
                            >
                                {/* Se deshabilita solo si esta destildado, para no dejar encerrado al que ya lo tenia */}
                                <input
                                    type="checkbox"
                                    disabled={!canSetNoExpiration && !hasNoExpiration(index)}
                                    {...register(`batches.${index}.noExpiration`)}
                                />
                                Sin vencimiento
                            </label>

                            <button
                                type="button"
                                onClick={() => removeBatch(index)}
                                className="shrink-0 rounded-md px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                            >
                                Quitar
                            </button>
                        </div>

                        <div className="mt-2 flex items-center justify-between">
                            <span className="text-xs text-slate-400">
                                {field.receivedAt
                                    ? `Recibido el ${toDisplayDate(field.receivedAt)}`
                                    : "Se registra al guardar"}
                            </span>
                            {errors.batches?.[index]?.expirationDate && (
                                <p className={errorClass}>{errors.batches[index]?.expirationDate?.message}</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-3 flex items-center gap-3">
                <button
                    type="button"
                    onClick={addBatch}
                    disabled={!canAddBatch}
                    className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:border-slate-200 disabled:text-slate-300 disabled:hover:bg-transparent"
                >
                    Agregar lote
                </button>
                {!canAddBatch && (
                    <span className="text-xs text-slate-400">
                        Un lote sin vencimiento no se combina con otros
                    </span>
                )}
            </div>
        </div>
    );
};
