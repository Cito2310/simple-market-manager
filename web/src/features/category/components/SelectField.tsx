import { useSelectField } from "../hooks/useSelectField";
import { SelectOptionRow } from "./SelectOptionRow";

interface SelectFieldProps {
    id: string;
    label: string;
    value: string;
    placeholder: string;
    options: readonly string[];
    // Valor elegido que ya no esta en el catalogo: se muestra pero no se puede editar
    orphanLabel?: string;
    disabled?: boolean;
    error?: string;
    hint?: string;
    isEditable?: boolean;
    isSaving?: boolean;
    actionError?: string | null;
    onSelect: (value: string) => void;
    onCreate?: (name: string) => Promise<boolean>;
    onRename?: (previous: string, next: string) => Promise<boolean>;
    onDelete?: (name: string) => void;
}

const labelClass = "mb-1 block text-sm font-medium text-slate-700";
const triggerClass =
    "flex w-full items-center justify-between gap-2 rounded-md border border-slate-300 px-3 py-2 text-left text-sm outline-none transition focus:border-slate-500 disabled:bg-slate-50 disabled:text-slate-400";
const panelClass = "absolute left-0 right-0 z-20 mt-1 rounded-md border border-slate-200 bg-white shadow-lg";
const filterClass = "w-full rounded border border-slate-200 px-2 py-1 text-sm outline-none focus:border-slate-400";
const createButtonClass =
    "shrink-0 rounded bg-slate-900 px-3 py-1 text-sm font-medium text-white transition hover:bg-slate-700 disabled:opacity-50";
const errorClass = "mt-1 text-xs text-red-600";
const hintClass = "mt-1 text-xs text-amber-600";

export const SelectField = ({
    id,
    label,
    value,
    placeholder,
    options,
    orphanLabel,
    disabled = false,
    error,
    hint,
    isEditable = false,
    isSaving = false,
    actionError = null,
    onSelect,
    onCreate,
    onRename,
    onDelete
}: SelectFieldProps) => {
    // El buscador es tambien el campo de creacion: lo tipeado es el nombre nuevo
    const field = useSelectField(options, onSelect, () => void confirmCreating());

    const confirmCreating = async (): Promise<void> => {
        if (!onCreate) return;
        // Lo recien creado queda seleccionado, asi que se cierra el panel entero
        if (await onCreate(field.filter)) field.close();
    };

    const confirmEditing = async (): Promise<void> => {
        if (!onRename || field.editingOption === null) return;
        if (await onRename(field.editingOption, field.draft)) field.cancelEditing();
    };

    const canCreate = isEditable && field.canCreate;

    return (
        <div ref={field.containerRef} className="relative">
            <label className={labelClass} htmlFor={id}>{label}</label>
            <button
                id={id}
                type="button"
                disabled={disabled}
                onClick={field.toggle}
                className={triggerClass}
            >
                <span className={`truncate ${value === "" ? "text-slate-400" : "text-slate-900"}`}>
                    {value === "" ? placeholder : value}
                </span>
                <span className="shrink-0 text-xs text-slate-400">&#9662;</span>
            </button>

            {field.isOpen && (
                <div className={panelClass}>
                    <div className="border-b border-slate-100 p-2">
                        <div className="flex items-center gap-2">
                            <input
                                autoFocus
                                className={filterClass}
                                placeholder={isEditable ? "Buscar o crear..." : "Buscar..."}
                                value={field.filter}
                                disabled={isSaving}
                                onChange={(event) => field.setFilter(event.target.value)}
                                onKeyDown={field.handleFilterKeyDown}
                            />
                            {canCreate && (
                                <button
                                    type="button"
                                    onClick={confirmCreating}
                                    disabled={isSaving}
                                    className={createButtonClass}
                                >
                                    {isSaving ? "..." : "Agregar"}
                                </button>
                            )}
                        </div>
                        {actionError && field.editingOption === null && (
                            <p className="mt-1 text-xs text-red-600">{actionError}</p>
                        )}
                    </div>

                    <ul className="max-h-56 overflow-y-auto py-1">
                        {value !== "" && (
                            <li>
                                <button
                                    type="button"
                                    onClick={() => field.selectOption("")}
                                    className="w-full px-3 py-1.5 text-left text-sm text-slate-400 transition hover:bg-slate-50"
                                >
                                    Sin seleccionar
                                </button>
                            </li>
                        )}

                        {orphanLabel !== undefined && (
                            <SelectOptionRow
                                name={value}
                                label={orphanLabel}
                                isSelected
                                isHighlighted={false}
                                isEditable={false}
                                isEditing={false}
                                draft={field.draft}
                                isSaving={isSaving}
                                error={actionError}
                                onSelect={field.close}
                                onHighlight={() => undefined}
                                onDraftChange={field.setDraft}
                                onStartEditing={() => undefined}
                                onConfirmEditing={() => undefined}
                                onCancelEditing={field.cancelEditing}
                                onDelete={() => undefined}
                            />
                        )}

                        {field.filteredOptions.map((option, index) => (
                            <SelectOptionRow
                                key={option}
                                name={option}
                                isSelected={option === value}
                                isHighlighted={index === field.highlighted}
                                isEditable={isEditable}
                                isEditing={field.editingOption === option}
                                draft={field.draft}
                                isSaving={isSaving}
                                error={actionError}
                                onSelect={() => field.selectOption(option)}
                                onHighlight={() => field.setHighlighted(index)}
                                onDraftChange={field.setDraft}
                                onStartEditing={() => field.startEditing(option)}
                                onConfirmEditing={confirmEditing}
                                onCancelEditing={field.cancelEditing}
                                onDelete={() => onDelete?.(option)}
                            />
                        ))}

                        {field.filteredOptions.length === 0 && (
                            <li className="px-3 py-2 text-sm text-slate-400">
                                {canCreate ? "Sin resultados: tocá Agregar o Enter" : "Sin resultados"}
                            </li>
                        )}
                    </ul>
                </div>
            )}

            {error && <p className={errorClass}>{error}</p>}
            {hint && <p className={hintClass}>{hint}</p>}
        </div>
    );
};
