import type { ReactNode } from "react";
import type { CashMovementType } from "@shared/types/CashSession";
import { Modal } from "../../../shared/components/Modal";
import type { ModalButton } from "../../../shared/components/Modal";
import { formatPrice } from "../../../shared/helpers/formatPrice";
import { buildCashCount, totalByType } from "../cashOperations";
import { useCashCount } from "../hooks/useCashCount";
import { useCashMovementForm } from "../hooks/useCashMovementForm";
import type { CashModalState } from "../hooks/useCashModal";
import { CashCloseSummary } from "./CashCloseSummary";
import { CashCountForm } from "./CashCountForm";
import { CashMovementForm } from "./CashMovementForm";
import { CashSessionPanel } from "./CashSessionPanel";

interface CashModalProps {
    cash: CashModalState;
}

const MOVEMENT_TITLE: Record<CashMovementType, string> = {
    bundle: "Registrar taco",
    deposit: "Ingresar efectivo",
    withdraw: "Retirar efectivo"
};

const MOVEMENT_CONFIRM: Record<CashMovementType, string> = {
    bundle: "Registrar",
    deposit: "Ingresar",
    withdraw: "Retirar"
};

export const CashModal = ({ cash }: CashModalProps) => {
    const count = useCashCount();
    const form = useCashMovementForm();

    const { session, view, movementType, cashSales } = cash;
    const bundles = session ? totalByType(session.movements, "bundle") : 0;
    const movementAmount = movementType === "bundle" ? form.bundleAmount : form.plainAmount;
    // El retiro pide motivo si o si: es la unica salida de plata sin comprobante
    const isMovementValid =
        movementAmount > 0 && (movementType !== "withdraw" || form.note.trim() !== "");

    const startOpening = (): void => {
        count.reset();
        cash.startOpening();
    };

    const confirmOpening = (): void => {
        cash.confirmOpening(buildCashCount(count.entries, count.coinsAmount));
        count.reset();
    };

    const startMovement = (type: CashMovementType): void => {
        form.reset();
        cash.startMovement(type);
    };

    const confirmMovement = (): void => {
        cash.confirmMovement(movementAmount, form.note);
        form.reset();
    };

    const startClosing = (): void => {
        count.reset();
        cash.startClosing();
    };

    const confirmClosing = (): void => {
        cash.confirmClosing(buildCashCount(count.entries, count.coinsAmount));
        count.reset();
    };

    const content = (): ReactNode => {
        if (view === "opening") {
            return <CashCountForm count={count} hint="Conta el efectivo con el que arranca el turno." />;
        }

        if (view === "movement") {
            return <CashMovementForm type={movementType} form={form} amount={movementAmount} />;
        }

        if (view === "closing") {
            return (
                <CashCountForm
                    count={count}
                    hint={`Conta solo el efectivo suelto: los ${formatPrice(
                        bundles
                    )} en tacos ya registrados se suman aparte.`}
                />
            );
        }

        if (session && view === "open") {
            return (
                <CashSessionPanel
                    session={session}
                    cashSales={cashSales}
                    onMovement={startMovement}
                    onRemoveMovement={cash.removeMovement}
                    onClose={startClosing}
                />
            );
        }

        if (session && view === "summary") {
            return <CashCloseSummary session={session} cashSales={cashSales} />;
        }

        return (
            <div className="px-6 py-8 text-center text-sm text-slate-500">
                <p className="font-medium text-slate-700">La caja esta cerrada</p>
                <p className="mt-1">Al abrirla se registra el arqueo del efectivo inicial del turno.</p>
            </div>
        );
    };

    const footerButtons = (): ModalButton[] => {
        if (view === "opening") {
            return [
                { label: "Volver", type: "secondary", onClick: cash.backToClosed },
                { label: "Abrir caja", type: "primary", onClick: confirmOpening }
            ];
        }

        if (view === "movement") {
            return [
                { label: "Volver", type: "secondary", onClick: cash.backToSession },
                {
                    label: MOVEMENT_CONFIRM[movementType],
                    type: "primary",
                    onClick: confirmMovement,
                    disabled: !isMovementValid
                }
            ];
        }

        if (view === "closing") {
            return [
                { label: "Volver", type: "secondary", onClick: cash.backToSession },
                { label: "Cerrar caja", type: "danger", onClick: confirmClosing }
            ];
        }

        if (view === "open") {
            return [{ label: "Listo", type: "primary", onClick: cash.close }];
        }

        if (view === "summary") {
            return [{ label: "Listo", type: "primary", onClick: cash.finishClosing }];
        }

        return [
            { label: "Volver", type: "secondary", onClick: cash.close },
            { label: "Abrir caja", type: "primary", onClick: startOpening }
        ];
    };

    const title = (): string => {
        if (view === "opening") return "Arqueo de apertura";
        if (view === "movement") return MOVEMENT_TITLE[movementType];
        if (view === "closing") return "Arqueo de cierre";
        if (view === "summary") return "Cierre de caja";
        if (view === "open") return "Caja abierta";

        return "Caja";
    };

    return (
        <Modal title={title()} onClose={cash.close} footerButtons={footerButtons()}>
            {content()}
        </Modal>
    );
};
