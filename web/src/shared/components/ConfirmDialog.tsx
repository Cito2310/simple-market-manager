import type { ReactNode } from "react";
import { Modal } from "./Modal";

interface ConfirmDialogProps {
    title: string;
    message: ReactNode;
    confirmLabel?: string;
    isSubmitting?: boolean;
    error?: string | null;
    onConfirm: () => void;
    onCancel: () => void;
}

export const ConfirmDialog = ({
    title,
    message,
    confirmLabel = "Confirmar",
    isSubmitting = false,
    error = null,
    onConfirm,
    onCancel
}: ConfirmDialogProps) => {
    return (
        <Modal title={title} onClose={onCancel}>
            <div className="px-6 py-5 text-sm text-slate-600">{message}</div>

            {error && (
                <p className="mx-6 mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                    {error}
                </p>
            )}

            <footer className="flex justify-end gap-3 border-t border-slate-200 px-6 py-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="rounded-md px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
                >
                    Cancelar
                </button>
                <button
                    type="button"
                    onClick={onConfirm}
                    disabled={isSubmitting}
                    className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-50"
                >
                    {isSubmitting ? "Eliminando..." : confirmLabel}
                </button>
            </footer>
        </Modal>
    );
};
