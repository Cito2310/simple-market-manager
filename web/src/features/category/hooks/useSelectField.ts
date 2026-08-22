import { useEffect, useMemo, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { useClickOutside } from "../../../shared/hooks/useClickOutside";
import { normalize } from "../categoryOperations";

export const useSelectField = (
    options: readonly string[],
    onSelect: (value: string) => void,
    onCreate?: () => void
) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [filter, setFilter] = useState("");
    const [highlighted, setHighlighted] = useState(0);

    // Renombrar es lo unico con borrador propio: crear se hace con el texto del buscador
    const [editingOption, setEditingOption] = useState<string | null>(null);
    const [draft, setDraft] = useState("");

    const filteredOptions = useMemo(() => {
        const term = normalize(filter);
        if (term === "") {
            return options;
        }
        return options.filter((option) => option.includes(term));
    }, [options, filter]);

    // Ofrecer crear algo que ya existe no tiene sentido
    const canCreate = useMemo(() => {
        const term = normalize(filter);
        return term !== "" && !options.includes(term);
    }, [options, filter]);

    // El resaltado vuelve al principio cada vez que cambia la lista visible
    useEffect(() => {
        setHighlighted(0);
    }, [filter]);

    const close = (): void => {
        setIsOpen(false);
        setFilter("");
        setEditingOption(null);
        setDraft("");
    };

    useClickOutside(containerRef, close);

    const toggle = (): void => {
        if (isOpen) {
            close();
            return;
        }
        setIsOpen(true);
    };

    const selectOption = (value: string): void => {
        onSelect(value);
        close();
    };

    const startEditing = (option: string): void => {
        setEditingOption(option);
        setDraft(option);
    };

    const cancelEditing = (): void => {
        setEditingOption(null);
        setDraft("");
    };

    const handleFilterKeyDown = (event: KeyboardEvent<HTMLInputElement>): void => {
        if (event.key === "ArrowDown") {
            event.preventDefault();
            setHighlighted((current) => Math.min(current + 1, filteredOptions.length - 1));
        }
        if (event.key === "ArrowUp") {
            event.preventDefault();
            setHighlighted((current) => Math.max(current - 1, 0));
        }
        if (event.key === "Enter") {
            event.preventDefault();
            const option = filteredOptions[highlighted];
            // Con resultados a la vista Enter elige; si la busqueda no encontro nada, crea
            if (option !== undefined) {
                selectOption(option);
            } else if (canCreate && onCreate) {
                onCreate();
            }
        }
        if (event.key === "Escape") {
            event.preventDefault();
            // El modal de arriba tambien escucha Escape, por eso se corta la propagacion
            event.stopPropagation();
            close();
        }
    };

    return {
        containerRef,
        isOpen,
        toggle,
        close,
        filter,
        setFilter,
        filteredOptions,
        canCreate,
        highlighted,
        setHighlighted,
        editingOption,
        draft,
        setDraft,
        startEditing,
        cancelEditing,
        selectOption,
        handleFilterKeyDown
    };
};
