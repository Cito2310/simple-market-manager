import { useCallback, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import type { SizeUnit } from "@shared/types/Product";
import { useAppDispatch } from "../../../app/hooks";
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

type FormErrors = Partial<Record<keyof ProductFormValues, string>>;

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

const isPositiveNumber = (value: string): boolean => value.trim() !== "" && Number(value) >= 0;

const validate = (values: ProductFormValues): FormErrors => {
    const errors: FormErrors = {};
    if (!values.name.trim()) errors.name = "Requerido";
    if (!values.brand.trim()) errors.brand = "Requerido";
    if (!values.category.trim()) errors.category = "Requerido";
    if (!values.subcategory.trim()) errors.subcategory = "Requerido";
    if (!isPositiveNumber(values.size)) errors.size = "Numero mayor o igual a 0";
    if (!isPositiveNumber(values.cost)) errors.cost = "Numero mayor o igual a 0";
    if (!isPositiveNumber(values.salePrice)) errors.salePrice = "Numero mayor o igual a 0";
    return errors;
};

export const useProductForm = (product: ApiProduct | undefined, onClose: () => void) => {
    const dispatch = useAppDispatch();
    const [values, setValues] = useState<ProductFormValues>(product ? toFormValues(product) : emptyValues);
    const [errors, setErrors] = useState<FormErrors>({});
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (field: keyof ProductFormValues) => (
        event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ): void => {
        const target = event.target;
        const value = target instanceof HTMLInputElement && target.type === "checkbox" ? target.checked : target.value;
        setValues((current) => ({ ...current, [field]: value }));
    };

    // El select de categoría cascadea: cada nivel limpia los de abajo, así que llegan todos juntos
    const setCategoryFields = useCallback((next: { category: string; subcategory: string; brand: string }): void => {
        setValues((current) => ({ ...current, ...next }));
    }, []);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault();

        const validationErrors = validate(values);
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length > 0) {
            return;
        }

        const details = {
            name: values.name.trim(),
            brand: values.brand.trim(),
            category: values.category.trim(),
            subcategory: values.subcategory.trim(),
            barcodes: values.barcodes.split(",").map((code) => code.trim()).filter(Boolean),
            size: Number(values.size),
            sizeUnit: values.sizeUnit
        };
        const prices = { cost: Number(values.cost), salePrice: Number(values.salePrice) };

        setIsSubmitting(true);
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
        } catch (error) {
            setSubmitError(error instanceof Error ? error.message : String(error));
        } finally {
            setIsSubmitting(false);
        }
    };

    return { values, errors, submitError, isSubmitting, handleChange, setCategoryFields, handleSubmit };
};
