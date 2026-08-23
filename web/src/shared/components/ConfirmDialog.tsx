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
}: ConfirmDialogProps) => (
    <Modal
        title={title}
        onClose={onCancel}
        footerButtons={[
            { label: "Cancelar", type: "secondary", onClick: onCancel },
            {
                label: isSubmitting ? "Eliminando..." : confirmLabel,
                type: "danger",
                onClick: onConfirm,
                disabled: isSubmitting
            }
        ]}
    >
        <div className="px-6 py-5 text-sm text-slate-600">{message}</div>

        {error && (
            <p className="mx-6 mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
            </p>
        )}
    </Modal>
);
