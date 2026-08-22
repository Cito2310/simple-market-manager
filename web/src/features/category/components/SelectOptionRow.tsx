import { OptionEditRow } from "./OptionEditRow";

interface SelectOptionRowProps {
    name: string;
    label?: string;
    isSelected: boolean;
    isHighlighted: boolean;
    isEditable: boolean;
    isEditing: boolean;
    draft: string;
    isSaving: boolean;
    error: string | null;
    onSelect: () => void;
    onHighlight: () => void;
    onDraftChange: (value: string) => void;
    onStartEditing: () => void;
    onConfirmEditing: () => void;
    onCancelEditing: () => void;
    onDelete: () => void;
}

const iconButtonClass =
    "shrink-0 rounded px-2 py-1 text-xs text-slate-400 transition hover:bg-slate-200 hover:text-slate-700";

export const SelectOptionRow = ({
    name,
    label,
    isSelected,
    isHighlighted,
    isEditable,
    isEditing,
    draft,
    isSaving,
    error,
    onSelect,
    onHighlight,
    onDraftChange,
    onStartEditing,
    onConfirmEditing,
    onCancelEditing,
    onDelete
}: SelectOptionRowProps) => {
    if (isEditing) {
        return (
            <li>
                <OptionEditRow
                    value={draft}
                    isSaving={isSaving}
                    error={error}
                    onChange={onDraftChange}
                    onConfirm={onConfirmEditing}
                    onCancel={onCancelEditing}
                />
            </li>
        );
    }

    return (
        <li>
            <div
                onMouseEnter={onHighlight}
                className={`flex items-center gap-1 px-1 ${isHighlighted ? "bg-slate-100" : ""}`}
            >
                <button
                    type="button"
                    onClick={onSelect}
                    className={`flex-1 truncate rounded px-2 py-1.5 text-left text-sm ${
                        isSelected ? "font-semibold text-slate-900" : "text-slate-700"
                    }`}
                >
                    {label ?? name}
                </button>
                {isEditable && (
                    <>
                        <button
                            type="button"
                            title="Renombrar"
                            onClick={onStartEditing}
                            className={iconButtonClass}
                        >
                            &#9998;
                        </button>
                        <button
                            type="button"
                            title="Borrar"
                            onClick={onDelete}
                            className={`${iconButtonClass} hover:text-red-600`}
                        >
                            &#10005;
                        </button>
                    </>
                )}
            </div>
        </li>
    );
};
