interface StockUpdateAlertProps {
    products: string[];
    onDismiss: () => void;
}

// La venta ya quedo registrada: esto solo avisa que el stock del server no se pudo actualizar
export const StockUpdateAlert = ({ products, onDismiss }: StockUpdateAlertProps) => (
    <div className="mb-4 flex items-start gap-3 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        <p className="flex-1">
            No se pudo actualizar el stock de{" "}
            <span className="font-medium capitalize">{products.join(", ")}</span>. La venta quedo
            registrada: revisa el stock a mano.
        </p>

        <button
            type="button"
            onClick={onDismiss}
            aria-label="Cerrar aviso"
            className="rounded p-1 text-amber-600 transition hover:bg-amber-100 hover:text-amber-800"
        >
            &#10005;
        </button>
    </div>
);
