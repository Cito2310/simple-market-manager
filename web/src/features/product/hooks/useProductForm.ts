import { useState } from "react";
import { useForm } from "react-hook-form";
import type { Inventory, SizeUnit } from "@shared/types/Product";
import { useAppDispatch } from "../../../app/store";
import type { CategorySelectValues } from "../../category/hooks/useCategorySelect";
import type { ProductApi } from "@shared/types/Product";
import { createProduct, updateProduct } from "../productThunks";

// Provisorio hasta que exista auth y el usuario salga del token
const CURRENT_USER = "web";

export interface BatchFormValue {
    // Vacio cuando el lote es nuevo: el _id lo genera Mongo al guardar
    batchId: string;
    quantity: string;
    expirationDate: string;
    // Marcado cuando el lote no vence: el campo de fecha queda deshabilitado
    noExpiration: boolean;
    // No se edita a mano: se sella al guardar el lote nuevo
    receivedAt: string;
}

export interface ProductFormValues {
    name: string;
    brand: string;
    category: string;
    subcategory: string;
    barcodes: { value: string }[];
    size: string;
    sizeUnit: SizeUnit;
    cost: string;
    salePrice: string;
    weighable: boolean;
    active: boolean;
    alertsEnabled: boolean;
    alertsWarning: string;
    alertsLow: string;
    alertsCritical: string;
    batches: BatchFormValue[];
}

const emptyValues: ProductFormValues = {
    name: "",
    brand: "",
    category: "",
    subcategory: "",
    barcodes: [{ value: "" }],
    size: "1",
    sizeUnit: "unit",
    cost: "0",
    salePrice: "0",
    weighable: false,
    active: true,
    alertsEnabled: false,
    alertsWarning: "0",
    alertsLow: "0",
    alertsCritical: "0",
    batches: []
};

// La ultima fila queda siempre vacia: es la que se usa para cargar el codigo siguiente
const toBarcodeFields = (barcodes: string[]): { value: string }[] => [
    ...barcodes.map((value) => ({ value })),
    { value: "" }
];

// Los <input type="date"> trabajan con "YYYY-MM-DD", no con Date
const toDateInput = (value?: Date | string): string =>
    value ? new Date(value).toISOString().slice(0, 10) : "";

const toBatchFields = (product: ProductApi): BatchFormValue[] =>
    (product.inventory?.batches ?? []).map((batch) => ({
        batchId: batch._id,
        quantity: String(batch.quantity),
        expirationDate: toDateInput(batch.expirationDate),
        noExpiration: batch.expirationDate === undefined,
        receivedAt: toDateInput(batch.receivedAt)
    }));

const toFormValues = (product: ProductApi): ProductFormValues => ({
    name: product.details.name,
    brand: product.details.brand,
    category: product.details.category,
    subcategory: product.details.subcategory,
    barcodes: toBarcodeFields(product.details.barcodes),
    size: String(product.details.size),
    sizeUnit: product.details.sizeUnit,
    cost: String(product.sell.cost),
    salePrice: String(product.sell.salePrice),
    weighable: product.sell.weighable,
    active: product.active,
    alertsEnabled: product.inventory?.alerts.enabled ?? false,
    alertsWarning: String(product.inventory?.alerts.warning ?? 0),
    alertsLow: String(product.inventory?.alerts.low ?? 0),
    alertsCritical: String(product.inventory?.alerts.critical ?? 0),
    batches: toBatchFields(product)
});

export const useProductForm = (product: ProductApi | undefined, onClose: () => void) => {
    const dispatch = useAppDispatch();
    const [submitError, setSubmitError] = useState<string | null>(null);

    const {
        register,
        control,
        handleSubmit: rhfHandleSubmit,
        watch,
        setValue,
        formState: { errors, isSubmitting }
    } = useForm<ProductFormValues>({ defaultValues: product ? toFormValues(product) : emptyValues });

    const categoryValues: CategorySelectValues = {
        category: watch("category"),
        subcategory: watch("subcategory"),
        brand: watch("brand")
    };

    // Un solo cambio de la cascada escribe los tres campos a la vez
    const setCategoryFields = (next: CategorySelectValues): void => {
        setValue("category", next.category, { shouldValidate: true });
        setValue("subcategory", next.subcategory, { shouldValidate: true });
        setValue("brand", next.brand, { shouldValidate: true });
    };

    const submit = async (values: ProductFormValues): Promise<void> => {
        const details = {
            name: values.name.trim(),
            brand: values.brand,
            category: values.category,
            subcategory: values.subcategory,
            barcodes: values.barcodes.map((barcode) => barcode.value.trim()).filter(Boolean),
            size: Number(values.size),
            sizeUnit: values.sizeUnit
        };
        const prices = { cost: Number(values.cost), salePrice: Number(values.salePrice) };

        // El _id solo viaja si el lote ya existia; a los nuevos se lo pone Mongo
        const inventory = {
            batches: values.batches.map((batch) => ({
                ...(batch.batchId ? { _id: batch.batchId } : {}),
                quantity: Number(batch.quantity),
                ...(batch.noExpiration || !batch.expirationDate
                    ? {}
                    : { expirationDate: new Date(batch.expirationDate) }),
                // Los lotes nuevos llegan sin fecha y se sellan con el momento del guardado
                receivedAt: batch.receivedAt ? new Date(batch.receivedAt) : new Date()
            })),
            alerts: {
                enabled: values.alertsEnabled,
                warning: Number(values.alertsWarning),
                low: Number(values.alertsLow),
                critical: Number(values.alertsCritical)
            }
        } as Inventory;

        setSubmitError(null);
        try {
            if (product) {
                // La API reemplaza el documento entero, así que se arrastra todo lo que el formulario no edita
                await dispatch(
                    updateProduct({
                        ...product,
                        details,
                        sell: { ...product.sell, ...prices, weighable: values.weighable },
                        inventory,
                        active: values.active,
                        updatedBy: CURRENT_USER
                    })
                ).unwrap();
            } else {
                await dispatch(
                    createProduct({
                        details,
                        sell: { ...prices, promotions: [], weighable: values.weighable },
                        inventory,
                        active: values.active,
                        createdBy: CURRENT_USER,
                        updatedBy: CURRENT_USER
                    })
                ).unwrap();
            }
            onClose();
        } catch (caught) {
            setSubmitError(caught instanceof Error ? caught.message : String(caught));
        }
    };

    return {
        register,
        control,
        errors,
        isSubmitting,
        submitError,
        categoryValues,
        setCategoryFields,
        handleSubmit: rhfHandleSubmit(submit)
    };
};
