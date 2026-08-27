import { ConfirmDialog } from "../../../shared/components/ConfirmDialog";
import { formatPrice } from "../../../shared/helpers/formatPrice";

interface CancelSaleDialogProps {
    ticketCount: number;
    total: number;
    onConfirm: () => void;
    onCancel: () => void;
}

export const CancelSaleDialog = ({
    ticketCount,
    total,
    onConfirm,
    onCancel
}: CancelSaleDialogProps) => (
    <ConfirmDialog
        title="Cancelar venta"
        confirmLabel="Descartar venta"
        onConfirm={onConfirm}
        onCancel={onCancel}
        message={
            <>
                Vas a descartar{" "}
                <span className="font-medium text-slate-900">
                    {ticketCount} {ticketCount === 1 ? "producto" : "productos"}
                </span>{" "}
                por <span className="font-medium tabular-nums text-slate-900">{formatPrice(total)}</span>.
                El ticket se vacia y no se puede recuperar.
            </>
        }
    />
);
