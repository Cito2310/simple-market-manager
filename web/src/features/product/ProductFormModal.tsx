import { SECTIONS } from "@shared/types/Category";
import { SIZE_UNITS } from "@shared/types/Product";
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
    const { values, errors, submitError, isSubmitting, handleChange, handleSubmit } = useProductForm(product, onClose);

    return (
        <Modal title={product ? "Editar producto" : "Nuevo producto"} onClose={onClose}>
            <form onSubmit={handleSubmit}>
                <div className="grid gap-4 px-6 py-5 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                        <label className={labelClass} htmlFor="name">Nombre</label>
                        <input id="name" className={fieldClass} value={values.name} onChange={handleChange("name")} />
                        {errors.name && <p className={errorClass}>{errors.name}</p>}
                    </div>

                    <div>
                        <label className={labelClass} htmlFor="brand">Marca</label>
                        <input id="brand" className={fieldClass} value={values.brand} onChange={handleChange("brand")} />
                        {errors.brand && <p className={errorClass}>{errors.brand}</p>}
                    </div>

                    <div>
                        <label className={labelClass} htmlFor="section">Seccion</label>
                        <select id="section" className={fieldClass} value={values.section} onChange={handleChange("section")}>
                            {SECTIONS.map((section) => (
                                <option key={section} value={section}>{section}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className={labelClass} htmlFor="category">Categoria</label>
                        <input id="category" className={fieldClass} value={values.category} onChange={handleChange("category")} />
                        {errors.category && <p className={errorClass}>{errors.category}</p>}
                    </div>

                    <div>
                        <label className={labelClass} htmlFor="subcategory">Subcategoria</label>
                        <input id="subcategory" className={fieldClass} value={values.subcategory} onChange={handleChange("subcategory")} />
                        {errors.subcategory && <p className={errorClass}>{errors.subcategory}</p>}
                    </div>

                    <div>
                        <label className={labelClass} htmlFor="size">Tamanio</label>
                        <input id="size" type="number" step="any" className={fieldClass} value={values.size} onChange={handleChange("size")} />
                        {errors.size && <p className={errorClass}>{errors.size}</p>}
                    </div>

                    <div>
                        <label className={labelClass} htmlFor="sizeUnit">Unidad</label>
                        <select id="sizeUnit" className={fieldClass} value={values.sizeUnit} onChange={handleChange("sizeUnit")}>
                            {SIZE_UNITS.map((unit) => (
                                <option key={unit} value={unit}>{unit}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className={labelClass} htmlFor="cost">Costo</label>
                        <input id="cost" type="number" step="any" className={fieldClass} value={values.cost} onChange={handleChange("cost")} />
                        {errors.cost && <p className={errorClass}>{errors.cost}</p>}
                    </div>

                    <div>
                        <label className={labelClass} htmlFor="salePrice">Precio de venta</label>
                        <input id="salePrice" type="number" step="any" className={fieldClass} value={values.salePrice} onChange={handleChange("salePrice")} />
                        {errors.salePrice && <p className={errorClass}>{errors.salePrice}</p>}
                    </div>

                    <div className="sm:col-span-2">
                        <label className={labelClass} htmlFor="barcodes">Codigos de barra</label>
                        <input id="barcodes" className={fieldClass} value={values.barcodes} onChange={handleChange("barcodes")} placeholder="Separados por coma" />
                    </div>

                    <label className="flex items-center gap-2 text-sm text-slate-700">
                        <input type="checkbox" checked={values.weighable} onChange={handleChange("weighable")} />
                        Se vende por peso
                    </label>

                    <label className="flex items-center gap-2 text-sm text-slate-700">
                        <input type="checkbox" checked={values.active} onChange={handleChange("active")} />
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
