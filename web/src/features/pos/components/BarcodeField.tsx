import type { KeyboardEvent } from "react";
import { MAX_BARCODE_LENGTH } from "../hooks/useBarcodeScanner";
import type { BarcodeScannerState } from "../hooks/useBarcodeScanner";
import { SHORTCUT_KEYS } from "../hooks/usePosShortcuts";

interface BarcodeFieldProps {
    barcode: BarcodeScannerState;
}

// En modo lector no es un input a proposito: el lector escribe sobre el documento y esto solo
// muestra. El modo manual si es un input, y al enfocarse pausa el lector por si solo
export const BarcodeField = ({ barcode }: BarcodeFieldProps) => {
    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>): void => {
        if (event.key === "Escape") barcode.closeManual();
    };

    return (
        <div>
            {barcode.isManual ? (
                <form onSubmit={barcode.submitManual}>
                    <input
                        value={barcode.manualValue}
                        onChange={(event) => barcode.changeManual(event.target.value)}
                        onKeyDown={handleKeyDown}
                        onBlur={barcode.closeManual}
                        autoFocus
                        autoComplete="off"
                        inputMode="numeric"
                        maxLength={MAX_BARCODE_LENGTH}
                        placeholder="Codigo a mano, Enter para agregar"
                        className={`w-full rounded-lg border px-3 py-2.5 text-sm tabular-nums text-slate-900 outline-none transition ${
                            barcode.error ? "border-red-400 bg-red-50" : "border-slate-500 bg-white"
                        }`}
                    />
                </form>
            ) : (
                <div
                    title={barcode.isListening ? "Lector activo" : "Lector en pausa"}
                    className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm transition ${
                        barcode.error ? "border-red-400 bg-red-50" : "border-slate-300 bg-slate-50"
                    }`}
                >
                    <span
                        className={`h-2 w-2 shrink-0 rounded-full ${
                            barcode.isListening ? "bg-emerald-500" : "bg-slate-300"
                        }`}
                    />

                    <span
                        className={`min-w-0 flex-1 truncate tabular-nums ${
                            barcode.value ? "text-slate-900" : "text-slate-400"
                        }`}
                    >
                        {barcode.value || "Escanear codigo..."}
                    </span>

                    <button
                        type="button"
                        onClick={barcode.openManual}
                        className="shrink-0 rounded px-2 py-0.5 text-xs font-medium text-slate-500 transition hover:bg-slate-200 hover:text-slate-700"
                    >
                        Manual {SHORTCUT_KEYS.manual}
                    </button>
                </div>
            )}

            {barcode.error && <p className="mt-1.5 text-xs text-red-600">{barcode.error}</p>}
        </div>
    );
};
