import { SIZE_UNITS } from "@shared/types/Product";
import { CategoryCascade } from "../category/components/CategoryCascade";
import { Modal } from "../../shared/components/Modal";
import { useProductForm } from "./hooks/useProductForm";
import type { ApiProduct } from "./productThunks";

interface ProductFormModalProps {
    product?: ApiProduct;
    onClose: () => void;
}

const fieldClass =
    "w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500";
const labelClass = "mb-1 block text-sm font-medium text-slate-700";
const errorClass = "mt-1 text-xs text-red-600";

export const ProductFormModal = ({ product, onClose }: ProductFormModalProps) => {
    const { register, errors, isSubmitting, submitError, categoryValues, setCategoryFields, handleSubmit } =
        useProductForm(product, onClose);

    return (
        <Modal title={product ? "Editar producto" : "Nuevo producto"} onClose={onClose}>
            <form onSubmit={handleSubmit}>
                <div className="grid gap-4 px-6 py-5 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                        <label className={labelClass} htmlFor="name">Nombre</label>
                        <input id="name" className={fieldClass} {...register("name", { required: "Requerido" })} />
                        {errors.name && <p className={errorClass}>{errors.name.message}</p>}
                    </div>

                    {/* La cascada se escribe con setValue, pero se registra igual para que RHF la valide */}
                    <input type="hidden" {...register("category", { required: "Requerido" })} />
                    <input type="hidden" {...register("subcategory", { required: "Requerido" })} />
                    <input type="hidden" {...register("brand", { required: "Requerido" })} />

                    <CategoryCascade
                        values={categoryValues}
                        onChange={setCategoryFields}
                        categoryError={errors.category?.message}
                        subcategoryError={errors.subcategory?.message}
                        brandError={errors.brand?.message}
                    />

                    <div>
                        <label className={labelClass} htmlFor="size">Tamanio</label>
                        <input
                            id="size"
                            type="number"
                            step="any"
                            className={fieldClass}
                            {...register("size", {
                                required: "Requerido",
                                min: { value: 0, message: "Tiene que ser mayor o igual a 0" }
                            })}
                        />
                        {errors.size && <p className={errorClass}>{errors.size.message}</p>}
                    </div>

                    <div>
                        <label className={labelClass} htmlFor="sizeUnit">Unidad</label>
                        <select id="sizeUnit" className={fieldClass} {...register("sizeUnit")}>
                            {SIZE_UNITS.map((unit) => (
                                <option key={unit} value={unit}>{unit}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className={labelClass} htmlFor="cost">Costo</label>
                        <input
                            id="cost"
                            type="number"
                            step="any"
                            className={fieldClass}
                            {...register("cost", {
                                required: "Requerido",
                                min: { value: 0, message: "Tiene que ser mayor o igual a 0" }
                            })}
                        />
                        {errors.cost && <p className={errorClass}>{errors.cost.message}</p>}
                    </div>

                    <div>
                        <label className={labelClass} htmlFor="salePrice">Precio de venta</label>
                        <input
                            id="salePrice"
                            type="number"
                            step="any"
                            className={fieldClass}
                            {...register("salePrice", {
                                required: "Requerido",
                                min: { value: 0, message: "Tiene que ser mayor o igual a 0" }
                            })}
                        />
                        {errors.salePrice && <p className={errorClass}>{errors.salePrice.message}</p>}
                    </div>

                    <div className="sm:col-span-2">
                        <label className={labelClass} htmlFor="barcodes">Codigos de barra</label>
                        <input
                            id="barcodes"
                            className={fieldClass}
                            placeholder="Separados por coma"
                            {...register("barcodes")}
                        />
                    </div>

                    <label className="flex items-center gap-2 text-sm text-slate-700">
                        <input type="checkbox" {...register("weighable")} />
                        Se vende por peso
                    </label>

                    <label className="flex items-center gap-2 text-sm text-slate-700">
                        <input type="checkbox" {...register("active")} />
                        Activo
                    </label>
                </div>

                {submitError && (
                    <p className="mx-6 mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                        No se pudo guardar: {submitError}
                    </p>
                )}

                <footer className="flex justify-end gap-3 border-t border-slate-200 px-6 py-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-md px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 disabled:opacity-50"
                    >
                        {isSubmitting ? "Guardando..." : "Guardar"}
                    </button>
                </footer>
            </form>
        </Modal>
    );
};
