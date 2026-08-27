import { useCallback, useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";

// El lector escribe como un teclado: se escucha todo el documento, sin foco en ningun campo
const isFormField = (element: Element | null): boolean =>
    element instanceof HTMLElement &&
    (element instanceof HTMLInputElement ||
        element instanceof HTMLSelectElement ||
        element instanceof HTMLTextAreaElement ||
        element.isContentEditable);

// Silencio que da por terminado un escaneo fallido. Es corto porque mide al lector, que tipea
// de a milisegundos: para cargar un codigo a mano esta el modo manual, que no tiene limite
const IDLE_CLEAR_MS = 100;

// El codigo mas largo que se usa en el local: llegado a este largo ya no hay nada que esperar
export const MAX_BARCODE_LENGTH = 13;

// onScan devuelve si el código fue reconocido: se prueba en cada tecla, asi el producto entra
// apenas se completa el codigo y no hace falta Enter
export const useBarcodeScanner = (onScan: (barcode: string) => boolean, enabled: boolean) => {
    const [value, setValue] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isFieldFocused, setIsFieldFocused] = useState(false);
    const [isManual, setIsManual] = useState(false);
    const [manualValue, setManualValue] = useState("");

    const bufferRef = useRef("");
    const timerRef = useRef<number | undefined>(undefined);
    const onScanRef = useRef(onScan);

    useEffect(() => {
        onScanRef.current = onScan;
    }, [onScan]);

    const setBuffer = useCallback((next: string): void => {
        bufferRef.current = next;
        setValue(next);
    }, []);

    const clearTimer = useCallback((): void => {
        window.clearTimeout(timerRef.current);
        timerRef.current = undefined;
    }, []);

    const fail = useCallback((): void => {
        const barcode = bufferRef.current.trim();

        if (!barcode) return;

        setError(`Código ${barcode} no encontrado`);
        setBuffer("");
    }, [setBuffer]);

    // Mientras se escribe en cualquier campo el lector se calla, si no le roba las teclas
    useEffect(() => {
        const update = (): void => {
            window.setTimeout(() => setIsFieldFocused(isFormField(document.activeElement)), 0);
        };

        update();
        document.addEventListener("focusin", update);
        document.addEventListener("focusout", update);

        return () => {
            document.removeEventListener("focusin", update);
            document.removeEventListener("focusout", update);
        };
    }, []);

    const isListening = enabled && !isFieldFocused;

    useEffect(() => {
        // Al pausarse se descarta lo tipeado: un codigo a medias no sirve
        if (!isListening) {
            clearTimer();
            setBuffer("");
            return;
        }

        const handleKey = (event: KeyboardEvent): void => {
            // Enter sigue disparando para el lector que lo mande como sufijo
            if (event.key === "Enter") {
                event.preventDefault();
                clearTimer();

                if (bufferRef.current.trim() && onScanRef.current(bufferRef.current.trim())) {
                    setBuffer("");
                    setError(null);
                    return;
                }

                fail();
                return;
            }

            if (event.key === "Backspace") {
                clearTimer();
                setBuffer(bufferRef.current.slice(0, -1));
                return;
            }

            // Las teclas de funcion y los atajos no son parte del codigo
            if (event.key.length !== 1 || event.ctrlKey || event.altKey || event.metaKey) return;

            const next = bufferRef.current + event.key;

            clearTimer();
            setBuffer(next);
            setError(null);

            if (onScanRef.current(next.trim())) {
                setBuffer("");
                return;
            }

            // Completo y sin match: se avisa en el momento en vez de esperar el silencio, y el
            // buffer arranca de cero para que las teclas que sobren no arrastren el codigo viejo
            if (next.length >= MAX_BARCODE_LENGTH) {
                fail();
                return;
            }

            timerRef.current = window.setTimeout(fail, IDLE_CLEAR_MS);
        };

        document.addEventListener("keydown", handleKey);

        return () => {
            document.removeEventListener("keydown", handleKey);
            clearTimer();
        };
    }, [isListening, clearTimer, fail, setBuffer]);

    // Modo manual: un input de verdad para la etiqueta que no lee. Al enfocarse pausa el lector
    const openManual = useCallback((): void => {
        clearTimer();
        setBuffer("");
        setManualValue("");
        setError(null);
        setIsManual(true);
    }, [clearTimer, setBuffer]);

    const closeManual = useCallback((): void => {
        setIsManual(false);
        setManualValue("");
    }, []);

    const changeManual = useCallback((next: string): void => {
        setManualValue(next);
        setError(null);
    }, []);

    const submitManual = useCallback(
        (event: FormEvent): void => {
            event.preventDefault();
            const barcode = manualValue.trim();

            if (!barcode) return;

            // Si no existe se queda en manual, con el codigo a la vista para corregirlo
            if (!onScanRef.current(barcode)) {
                setError(`Código ${barcode} no encontrado`);
                return;
            }

            setError(null);
            closeManual();
        },
        [manualValue, closeManual]
    );

    return {
        value,
        error,
        isListening,
        isManual,
        manualValue,
        openManual,
        closeManual,
        changeManual,
        submitManual
    };
};

export type BarcodeScannerState = ReturnType<typeof useBarcodeScanner>;
