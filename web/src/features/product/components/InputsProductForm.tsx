import { SIZE_UNITS } from "@shared/types/Product";
import type { Control, FieldErrors, Path, RegisterOptions, UseFormRegister } from "react-hook-form";
import { useProductBarcodes } from "../hooks/useProductBarcodes";
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

const BARCODE_MIN = 4;
const BARCODE_MAX = 24;

// Las filas vacias se descartan al guardar, asi que solo se mide lo que tiene algo escrito
const barcodeRules = {
    validate: (value: unknown) => {
        const barcode = String(value).trim();
        if (barcode === "") return true;
        return (
            (barcode.length >= BARCODE_MIN && barcode.length <= BARCODE_MAX) ||
            `Tiene que tener entre ${BARCODE_MIN} y ${BARCODE_MAX} caracteres`
        );
    }
};

interface barcodesProps {
    register: UseFormRegister<ProductFormValues>;
    control: Control<ProductFormValues>;
    errors: FieldErrors<ProductFormValues>;
}

export const InputBarcodesProductForm = ({ register, control, errors }: barcodesProps) => {
    const { fields, handleChange, removeBarcode, canRemove } = useProductBarcodes(control);

    return (
        <div className="sm:col-span-2">
            <span className={labelClass}>Codigos de barra</span>

            <div className="space-y-2">
                {fields.map((field, index) => {
                    const barcode = register(`barcodes.${index}.value`, barcodeRules);

                    return (
                        <div key={field.id}>
                            <div className="flex gap-2">
                                <input
                                    className={fieldClass}
                                    placeholder="Escanear o escribir"
                                    {...barcode}
                                    onChange={(event) => {
                                        void barcode.onChange(event);
                                        handleChange(index, event.target.value);
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => removeBarcode(index)}
                                    disabled={!canRemove}
                                    className="shrink-0 rounded-md px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:text-slate-300 disabled:hover:bg-transparent"
                                >
                                    Quitar
                                </button>
                            </div>

                            {errors.barcodes?.[index]?.value && (
                                <p className={errorClass}>{errors.barcodes[index]?.value?.message}</p>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// El server pide mayor a 0, no acepta un tamanio en cero
const sizeRules = {
    required: "Requerido",
    validate: (value: unknown) => Number(value) > 0 || "Tiene que ser mayor a 0"
};

interface sizeProps {
    register: UseFormRegister<ProductFormValues>;
    error?: string;
}

// El tamanio y su unidad se leen juntos ("1.5 l"), asi que se muestran como un solo control
export const InputSizeProductForm = ({ register, error }: sizeProps) => (
    <div>
        <label className={labelClass} htmlFor="size">Tamaño</label>

        <div className="flex rounded-md border border-slate-300 focus-within:border-slate-500">
            <input
                id="size"
                type="number"
                step="any"
                className="w-full min-w-0 rounded-l-md px-3 py-2 text-sm text-slate-900 outline-none"
                {...register("size", sizeRules)}
            />
            <select
                id="sizeUnit"
                aria-label="Unidad"
                className="w-20 shrink-0 rounded-r-md border-l border-slate-300 bg-slate-50 px-2 py-2 text-sm text-slate-600 outline-none"
                {...register("sizeUnit")}
            >
                {SIZE_UNITS.map((unit) => (
                    <option key={unit} value={unit}>{unit}</option>
                ))}
            </select>
        </div>

        {error && <p className={errorClass}>{error}</p>}
    </div>
);

interface checkboxProps {
    name: Path<ProductFormValues>;
    label: string;
    register: UseFormRegister<ProductFormValues>;
}

export const InputCheckboxProductForm = ({ name, label, register }: checkboxProps) => (
    <label className="flex items-center gap-2 text-sm text-slate-700">
        <input type="checkbox" {...register(name)} />
        {label}
    </label>
);
