import { Modal } from "../../../shared/components/Modal";
import { formatPrice } from "../../../shared/helpers/formatPrice";
import type { CheckoutModalState } from "../hooks/useCheckoutModal";
import { usePaymentLines } from "../hooks/usePaymentLines";
import type { TicketTotals } from "../posOperations";
import { PaymentRow } from "./PaymentRow";

interface CheckoutModalProps {
    totals: TicketTotals;
    checkout: CheckoutModalState;
}

export const CheckoutModal = ({ totals, checkout }: CheckoutModalProps) => {
    const { payments, remaining, isValid, addPayment, removePayment, updatePayment, toPayments } =
        usePaymentLines(totals.total);

    return (
        <Modal
            title="Finalizar venta"
            onClose={checkout.close}
            footerButtons={[
                { label: "Volver", type: "secondary", onClick: checkout.close },
                {
                    label: "Confirmar venta",
                    type: "primary",
                    onClick: () => checkout.confirm(toPayments()),
                    disabled: !isValid
                }
            ]}
        >
            <div className="space-y-5 px-6 py-5">
                <div className="flex items-baseline justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                    <span className="text-sm font-medium text-slate-500">TOTAL A COBRAR</span>
                    <span className="text-3xl font-semibold tabular-nums text-slate-900">
                        {formatPrice(totals.total)}
                    </span>
                </div>

                <div className="space-y-3">
                    <h3 className="text-xs font-medium uppercase tracking-wide text-slate-400">Pagos</h3>

                    {payments.map((payment) => (
                        <PaymentRow
                            key={payment._id}
                            payment={payment}
                            canRemove={payments.length > 1}
                            onChange={(changes) => updatePayment(payment._id, changes)}
                            onRemove={() => removePayment(payment._id)}
                        />
                    ))}

                    <button
                        type="button"
                        onClick={addPayment}
                        className="rounded-md border border-dashed border-slate-300 px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-400 hover:bg-slate-50"
                    >
                        + Agregar metodo
                    </button>
                </div>

                {/* El ticket solo se puede cerrar cuando los pagos suman exactamente el total */}
                <div className="flex items-baseline justify-between border-t border-slate-200 pt-4">
                    <span className="text-sm font-medium text-slate-500">
                        {remaining < 0 ? "SOBRA" : "RESTANTE"}
                    </span>
                    <span
                        className={`text-2xl font-semibold tabular-nums ${
                            remaining === 0 ? "text-emerald-700" : "text-red-600"
                        }`}
                    >
                        {formatPrice(Math.abs(remaining))}
                    </span>
                </div>

                <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
                    <input
                        type="checkbox"
                        checked={checkout.printTicket}
                        onChange={checkout.togglePrintTicket}
                        className="h-4 w-4 rounded border-slate-300 accent-slate-900"
                    />
                    Imprimir ticket
                </label>
            </div>
        </Modal>
    );
};
