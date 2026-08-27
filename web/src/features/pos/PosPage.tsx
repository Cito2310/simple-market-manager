import { CancelSaleDialog } from "./components/CancelSaleDialog";
import { CashModal } from "./components/CashModal";
import { CheckoutModal } from "./components/CheckoutModal";
import { PosSidebar } from "./components/PosSidebar";
import { ProductSearchModal } from "./components/ProductSearchModal";
import { StockUpdateAlert } from "./components/StockUpdateAlert";
import { TicketsModal } from "./components/TicketsModal";
import { TicketTable } from "./components/TicketTable";
import { usePosPage } from "./hooks/usePosPage";

export const PosPage = () => {
    const {
        lines,
        totals,
        status,
        barcode,
        cash,
        search,
        cancelSale,
        cashRegister,
        tickets,
        stock,
        removeLine,
        checkout
    } = usePosPage();

    return (
        <div className="flex h-full bg-slate-50">
            <section className="flex min-w-0 flex-1 flex-col px-6 py-6">
                {stock.failedProducts.length > 0 && (
                    <StockUpdateAlert
                        products={stock.failedProducts}
                        onDismiss={stock.dismissFailures}
                    />
                )}

                <TicketTable lines={lines} status={status} onRemove={removeLine} />
            </section>

            <PosSidebar
                ticketCount={lines.length}
                totals={totals}
                barcode={barcode}
                cash={cash}
                onSearch={search.open}
                onCash={cashRegister.open}
                onTickets={tickets.open}
                onCancelSale={cancelSale.open}
                onCheckout={checkout.open}
            />

            {search.isOpen && (
                <ProductSearchModal onSelect={search.selectProduct} onClose={search.close} />
            )}

            {checkout.isOpen && <CheckoutModal totals={totals} checkout={checkout} />}

            {cashRegister.isOpen && <CashModal cash={cashRegister} />}

            {tickets.isOpen && <TicketsModal tickets={tickets} />}

            {cancelSale.isOpen && (
                <CancelSaleDialog
                    ticketCount={lines.length}
                    total={totals.total}
                    onConfirm={cancelSale.confirm}
                    onCancel={cancelSale.close}
                />
            )}
        </div>
    );
};
