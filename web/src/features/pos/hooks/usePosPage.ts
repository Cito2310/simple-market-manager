import { useCallback } from "react";
import { useProducts } from "../../product/hooks/useProducts";
import { buildTicket, calculateTotals, findProductByBarcode } from "../posOperations";
import { saveTicket } from "../posStorage";
import { useBarcodeInput } from "./useBarcodeInput";
import { useTicketLines } from "./useTicketLines";

export const usePosPage = () => {
    const { products, status } = useProducts();
    const { lines, addProduct, removeLine, clearLines } = useTicketLines();

    const scan = useCallback(
        (barcode: string): boolean => {
            const product = findProductByBarcode(products, barcode);

            if (!product) return false;

            addProduct(product);
            return true;
        },
        [products, addProduct]
    );

    const barcode = useBarcodeInput(scan);
    const { focus } = barcode;

    // Por ahora el ticket se guarda en localStorage: todavía no hay endpoint de ventas
    const checkout = useCallback((): void => {
        if (lines.length === 0) return;

        saveTicket(buildTicket(lines));
        clearLines();
        focus();
    }, [lines, clearLines, focus]);

    return { lines, totals: calculateTotals(lines), status, barcode, removeLine, checkout };
};
