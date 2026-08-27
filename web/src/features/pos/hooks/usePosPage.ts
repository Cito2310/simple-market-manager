import { useCallback, useMemo } from "react";
import type { Payment } from "@shared/types/Ticket";
import { useProducts } from "../../product/hooks/useProducts";
import { buildBarcodeIndex, buildTicket, calculateTotals, parseScaleBarcode } from "../posOperations";
import { saveTicket } from "../posStorage";
import { useBarcodeScanner } from "./useBarcodeScanner";
import { useCancelSale } from "./useCancelSale";
import { useCashModal } from "./useCashModal";
import { useCashPayment } from "./useCashPayment";
import { useCheckoutModal } from "./useCheckoutModal";
import { usePosShortcuts } from "./usePosShortcuts";
import { useProductSearchModal } from "./useProductSearchModal";
import { useStockDiscount } from "./useStockDiscount";
import { useTicketLines } from "./useTicketLines";
import { useTicketsModal } from "./useTicketsModal";

export const usePosPage = () => {
    const { products, status } = useProducts();
    const { lines, addProduct, removeLine, clearLines } = useTicketLines();

    const totals = calculateTotals(lines);
    const cash = useCashPayment(totals.total);
    const { reset: resetCash } = cash;

    // Deja la caja lista para el proximo cliente, se haya cobrado o cancelado. Soltar el foco
    // es parte del reset: con el cursor en un campo el lector se queda en pausa
    const resetSale = useCallback((): void => {
        clearLines();
        resetCash();

        if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
    }, [clearLines, resetCash]);

    const search = useProductSearchModal(addProduct);
    const cashRegister = useCashModal();
    const tickets = useTicketsModal();
    const cancelSale = useCancelSale(resetSale);
    const stock = useStockDiscount();
    const { discountStock } = stock;

    // Por ahora el ticket se guarda en localStorage: todavía no hay endpoint de ventas
    const saveSale = useCallback(
        (payments: Payment[]): void => {
            if (lines.length === 0) return;

            saveTicket(buildTicket(lines, payments));
            discountStock(lines);
            resetSale();
        },
        [lines, discountStock, resetSale]
    );

    const checkout = useCheckoutModal(saveSale);

    // Con un modal abierto la caja no escucha: ni el lector ni las teclas de funcion
    const isModalOpen =
        search.isOpen || cashRegister.isOpen || tickets.isOpen || cancelSale.isOpen || checkout.isOpen;

    const barcodeIndex = useMemo(() => buildBarcodeIndex(products), [products]);

    const scan = useCallback(
        (barcode: string): boolean => {
            const product = barcodeIndex.get(barcode);

            if (product) {
                addProduct(product);
                return true;
            }

            // Etiqueta de balanza: el peso viene en el codigo y el producto se busca por su PLU
            const scale = parseScaleBarcode(barcode);

            if (!scale) return false;

            const weighed = barcodeIndex.get(scale.productCode);

            // Si el producto no esta marcado como pesable su precio no es por kilo: cobrar el
            // peso contra un precio por unidad seria cobrar de menos
            if (!weighed?.sell.weighable) return false;

            addProduct(weighed, scale.weight);
            return true;
        },
        [barcodeIndex, addProduct]
    );

    const barcode = useBarcodeScanner(scan, !isModalOpen);

    usePosShortcuts(!isModalOpen, {
        onSearch: search.open,
        onCash: cashRegister.open,
        onTickets: tickets.open,
        onManual: barcode.openManual,
        onCancelSale: lines.length > 0 ? cancelSale.open : undefined,
        onCheckout: lines.length > 0 ? checkout.open : undefined
    });

    return {
        lines,
        totals,
        status,
        barcode,
        cash,
        search,
        cancelSale,
        cashRegister,
        tickets,
        checkout,
        stock,
        removeLine
    };
};
