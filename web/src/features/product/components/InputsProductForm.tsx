import type { Path, RegisterOptions, UseFormRegister } from "react-hook-form";
import type { ProductFormValues } from "../hooks/useProductForm";

export const fieldClass =
    "w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500";
export const labelClass = "ml-1.5 mb-1 block text-sm font-medium text-slate-700";
export const errorClass = "mt-1 text-xs text-red-600";

interface InputTextProps {
    name: Path<ProductFormValues>;
    label: string;
    register: UseFormRegister<ProductFormValues>;
    rules?: RegisterOptions<ProductFormValues, Path<ProductFormValues>>;
    error?: string;
    type?: "text" | "number";
    step?: string;
    placeholder?: string;
    // Los campos anchos ocupan las dos columnas de la grilla del modal
    wide?: boolean;
}

export const InputTextProductForm = ({
    name,
    label,
    register,
    rules,
    error,
    type = "text",
    step,
    placeholder,
    wide = false
}: InputTextProps) => (
    <div className={wide ? "sm:col-span-2" : undefined}>
        <label className={labelClass} htmlFor={name}>{label}</label>
        <input
            id={name}
            type={type}
            step={step}
            placeholder={placeholder}
            className={fieldClass}
            {...register(name, rules)}
        />
        {error && <p className={errorClass}>{error}</p>}
    </div>
);
