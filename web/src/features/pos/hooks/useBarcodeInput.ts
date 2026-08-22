import { useCallback, useRef, useState } from "react";
import type { FormEvent } from "react";

// onScan devuelve si el código fue reconocido, para poder avisar cuando no existe el producto
export const useBarcodeInput = (onScan: (barcode: string) => boolean) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [value, setValue] = useState("");
    const [error, setError] = useState<string | null>(null);

    const changeValue = useCallback((next: string): void => {
        setValue(next);
        setError(null);
    }, []);

    const focus = useCallback((): void => inputRef.current?.focus(), []);

    const submit = useCallback(
        (event: FormEvent): void => {
            event.preventDefault();
            const barcode = value.trim();

            if (!barcode) return;

            if (!onScan(barcode)) {
                // El código queda seleccionado en el input para poder corregirlo a mano
                setError(`Código ${barcode} no encontrado`);
                inputRef.current?.select();
                return;
            }

            setValue("");
            setError(null);
        },
        [onScan, value]
    );

    return { inputRef, value, error, changeValue, submit, focus };
};
