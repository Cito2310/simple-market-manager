import { useState } from "react";
import { useForm } from "react-hook-form";
import type { SizeUnit } from "@shared/types/Product";
import { useAppDispatch } from "../../../app/hooks";
import type { CategorySelectValues } from "../../category/hooks/useCategorySelect";
import type { ApiProduct } from "../productThunks";
import { createProduct, updateProduct } from "../productThunks";

// Provisorio hasta que exista auth y el usuario salga del token
const CURRENT_USER = "web";

export interface ProductFormValues {
    name: string;
    brand: string;
    category: string;
    subcategory: string;
    barcodes: string;
    size: string;
    sizeUnit: SizeUnit;
    cost: string;
    salePrice: string;
    weighable: boolean;
    active: boolean;
}

const emptyValues: ProductFormValues = {
    name: "",
    brand: "",
    category: "",
    subcategory: "",
    barcodes: "",
    size: "1",
    sizeUnit: "unit",
    cost: "0",
    salePrice: "0",
    weighable: false,
    active: true
};

const toFormValues = (product: ApiProduct): ProductFormValues => ({
    name: product.details.name,
    brand: product.details.brand,
    category: product.details.category,
    subcategory: product.details.subcategory,
    barcodes: product.details.barcodes.join(", "),
    size: String(product.details.size),
    sizeUnit: product.details.sizeUnit,
    cost: String(product.sell.cost),
    salePrice: String(product.sell.salePrice),
    weighable: product.sell.weighable,
    active: product.active
});

export const useProductForm = (product: ApiProduct | undefined, onClose: () => void) => {
    const dispatch = useAppDispatch();
    const [submitError, setSubmitError] = useState<string | null>(null);

    const {
        register,
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
            barcodes: values.barcodes.split(",").map((code) => code.trim()).filter(Boolean),
            size: Number(values.size),
            sizeUnit: values.sizeUnit
        };
        const prices = { cost: Number(values.cost), salePrice: Number(values.salePrice) };

        setSubmitError(null);
        try {
            if (product) {
                // La API reemplaza el documento entero, así que se arrastra todo lo que el formulario no edita
                await dispatch(
                    updateProduct({
                        ...product,
                        details,
                        sell: { ...product.sell, ...prices, weighable: values.weighable },
                        active: values.active,
                        updatedBy: CURRENT_USER
                    })
                ).unwrap();
            } else {
                await dispatch(
                    createProduct({
                        details,
                        sell: { ...prices, promotions: [], weighable: values.weighable },
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
        errors,
        isSubmitting,
        submitError,
        categoryValues,
        setCategoryFields,
        handleSubmit: rhfHandleSubmit(submit)
    };
};
