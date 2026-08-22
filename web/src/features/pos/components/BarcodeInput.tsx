import type { FormEvent, RefObject } from "react";

interface BarcodeInputProps {
    inputRef: RefObject<HTMLInputElement>;
    value: string;
    error: string | null;
    onChange: (value: string) => void;
    onSubmit: (event: FormEvent) => void;
}

export const BarcodeInput = ({ inputRef, value, error, onChange, onSubmit }: BarcodeInputProps) => (
    <form onSubmit={onSubmit} className="mb-4">
        <input
            ref={inputRef}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            autoFocus
            autoComplete="off"
            className={`w-full rounded-lg border bg-white px-4 py-3 text-sm text-slate-900 outline-none ${
                error ? "border-red-400 focus:border-red-500" : "border-slate-300 focus:border-slate-500"
            }`}
            placeholder="Escanear codigo de barras..."
        />
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </form>
);
