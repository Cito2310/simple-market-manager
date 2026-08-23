import { CategoryCascade } from "../../category/components/CategoryCascade";
import { Modal } from "../../../shared/components/Modal";
import { useProductForm } from "../hooks/useProductForm";
import { InputBatchesProductForm } from "./InputBatchesProductForm";
import {
    InputBarcodesProductForm,
    InputCheckboxProductForm,
    InputSizeProductForm,
    InputTextProductForm
} from "./InputsProductForm";
import { SectionProductForm } from "./SectionProductForm";
import type { ProductApi } from "@shared/types/Product";

interface props {
    product?: ProductApi;
    onClose: () => void;
}

// Lo comparten el <form> y su boton de submit, que vive en el footer del Modal
const FORM_ID = "product-form";

// El precio y el costo aceptan 0
const priceRules = { required: "Requerido", min: { value: 0, message: "Tiene que ser mayor o igual a 0" } };
export const ModalProductForm = ({ product, onClose }: props) => {
    const {
        register,
        control,
        errors,
        isSubmitting,
        submitError,
        categoryValues,
        setCategoryFields,
        handleSubmit
    } = useProductForm(product, onClose);

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
                <SectionProductForm title="Detalles">
                    <InputBarcodesProductForm register={register} control={control} errors={errors} />



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
                        name="name"
                        label="Nombre"
                        placeholder="Nombre del Producto"
                        register={register}
                        rules={{ required: "Requerido" }}
                        error={errors.name?.message}
                    />

                    <InputSizeProductForm register={register} error={errors.size?.message} />

                </SectionProductForm>

                <SectionProductForm title="Venta">
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

                    <InputCheckboxProductForm name="weighable" label="Se vende por peso" register={register} />
                </SectionProductForm>

                <SectionProductForm title="Inventario">
                    <InputBatchesProductForm register={register} control={control} errors={errors} />

                    <InputCheckboxProductForm
                        name="alertsEnabled"
                        label="Avisar por stock bajo"
                        register={register}
                    />

                    <div className="sm:col-span-2 grid gap-4 sm:grid-cols-3">
                        <InputTextProductForm
                            name="alertsWarning"
                            label="Aviso"
                            type="number"
                            step="any"
                            register={register}
                            rules={priceRules}
                            error={errors.alertsWarning?.message}
                        />
                        <InputTextProductForm
                            name="alertsLow"
                            label="Bajo"
                            type="number"
                            step="any"
                            register={register}
                            rules={priceRules}
                            error={errors.alertsLow?.message}
                        />
                        <InputTextProductForm
                            name="alertsCritical"
                            label="Critico"
                            type="number"
                            step="any"
                            register={register}
                            rules={priceRules}
                            error={errors.alertsCritical?.message}
                        />
                    </div>
                </SectionProductForm>

                {submitError && (
                    <p className="mx-6 mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                        No se pudo guardar: {submitError}
                    </p>
                )}
            </form>
        </Modal>
    );
};
