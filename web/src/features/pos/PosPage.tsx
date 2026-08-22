import { BarcodeInput } from "./components/BarcodeInput";
import { TicketSummary } from "./components/TicketSummary";
import { TicketTable } from "./components/TicketTable";
import { usePosPage } from "./hooks/usePosPage";

export const PosPage = () => {
    const { lines, totals, status, barcode, removeLine, checkout } = usePosPage();

    return (
        <div className="flex h-screen bg-slate-50">
            <section className="flex min-w-0 flex-1 flex-col px-6 py-6">
                <header className="mb-4 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-slate-900">Punto de venta</h1>
                        <span className="text-sm text-slate-500">
                            {status === "loading" ? "Cargando productos..." : "Turno manana"}
                        </span>
                    </div>
                    <span className="text-sm text-slate-500">
                        {lines.length} {lines.length === 1 ? "producto" : "productos"}
                    </span>
                </header>

                <BarcodeInput
                    inputRef={barcode.inputRef}
                    value={barcode.value}
                    error={barcode.error}
                    onChange={barcode.changeValue}
                    onSubmit={barcode.submit}
                />

                <TicketTable lines={lines} onRemove={removeLine} />
            </section>

            <TicketSummary totals={totals} canCheckout={lines.length > 0} onCheckout={checkout} />
        </div>
    );
};
