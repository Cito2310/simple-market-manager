interface OptionEditRowProps {
    value: string;
    isSaving: boolean;
    error: string | null;
    onChange: (value: string) => void;
    onConfirm: () => void;
    onCancel: () => void;
}

export const OptionEditRow = ({
    value,
    isSaving,
    error,
    onChange,
    onConfirm,
    onCancel
}: OptionEditRowProps) => {
    return (
        <div className="px-2 py-1">
            <div className="flex items-center gap-1">
                <input
                    autoFocus
                    className="w-full rounded border border-slate-300 px-2 py-1 text-sm outline-none focus:border-slate-500"
                    value={value}
                    disabled={isSaving}
                    onChange={(event) => onChange(event.target.value)}
                    onKeyDown={(event) => {
                        if (event.key === "Enter") {
                            event.preventDefault();
                            onConfirm();
                        }
                        if (event.key === "Escape") {
                            event.preventDefault();
                            // El modal de arriba tambien escucha Escape, por eso se corta la propagacion
                            event.stopPropagation();
                            onCancel();
                        }
                    }}
                />
                <button
                    type="button"
                    onClick={onConfirm}
                    disabled={isSaving}
                    className="shrink-0 rounded bg-slate-900 px-2 py-1 text-xs font-medium text-white transition hover:bg-slate-700 disabled:opacity-50"
                >
                    {isSaving ? "..." : "Guardar"}
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={isSaving}
                    className="shrink-0 rounded px-2 py-1 text-xs text-slate-500 transition hover:bg-slate-200"
                >
                    Cancelar
                </button>
            </div>
            {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        </div>
    );
};
