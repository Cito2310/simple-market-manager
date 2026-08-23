import { SIZE_UNITS } from "@shared/types/Product";
import { CategoryCascade } from "../../category/components/CategoryCascade";
import { Modal } from "../../../shared/components/Modal";
import { useProductForm } from "../hooks/useProductForm";
import { fieldClass, InputTextProductForm, labelClass } from "./InputsProductForm";
import type { ProductApi } from "@shared/types/Product";

interface props {
    product?: ProductApi;
    onClose: () => void;
}

// Lo comparten el <form> y su boton de submit, que vive en el footer del Modal
const FORM_ID = "product-form";

// El precio y el costo aceptan 0, el tamanio no: el server pide mayor a 0
const priceRules = { required: "Requerido", min: { value: 0, message: "Tiene que ser mayor o igual a 0" } };
const sizeRules = {
    required: "Requerido",
    validate: (value: string | boolean) => Number(value) > 0 || "Tiene que ser mayor a 0"
};

export const ModalProductForm = ({ product, onClose }: props) => {
    const { register, errors, isSubmitting, submitError, categoryValues, setCategoryFields, handleSubmit } =
        useProductForm(product, onClose);

    return (
        <Modal
            title={product ? "Editar producto" : "Nuevo producto"}
            onClose={onClose}
            footerButtons={[
                { label: "Cancelar", type: "secondary", onClick: onClose },
                {
                    label: isSubmitting ? "Guardando..." : "Guardar",
                    type: "primary",
                    form: FORM_ID,
                    disabled: isSubmitting
                }
            ]}
        >
            <form id={FORM_ID} onSubmit={handleSubmit}>
                <div className="grid gap-4 px-6 py-5 sm:grid-cols-2">
                    <InputTextProductForm
                        name="name"
                        label="Nombre"
                        register={register}
                        rules={{ required: "Requerido" }}
                        error={errors.name?.message}
                        wide
                    />

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

                    <InputTextProductForm
                        name="size"
                        label="Tamaño"
                        type="number"
                        step="any"
                        register={register}
                        rules={sizeRules}
                        error={errors.size?.message}
                    />

                    <div>
                        <label className={labelClass} htmlFor="sizeUnit">Unidad</label>
                        <select id="sizeUnit" className={fieldClass} {...register("sizeUnit")}>
                            {SIZE_UNITS.map((unit) => (
                                <option key={unit} value={unit}>{unit}</option>
                            ))}
                        </select>
                    </div>

                    <InputTextProductForm
                        name="cost"
                        label="Costo"
                        type="number"
                        step="any"
                        register={register}
                        rules={priceRules}
                        error={errors.cost?.message}
                    />

                    <InputTextProductForm
                        name="salePrice"
                        label="Precio de venta"
                        type="number"
                        step="any"
                        register={register}
                        rules={priceRules}
                        error={errors.salePrice?.message}
                    />

                    <InputTextProductForm
                        name="barcodes"
                        label="Codigos de barra"
                        placeholder="Separados por coma"
                        register={register}
                        error={errors.barcodes?.message}
                        wide
                    />

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
            </form>
        </Modal>
    );
};
