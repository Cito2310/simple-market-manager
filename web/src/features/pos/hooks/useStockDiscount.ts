import { useCallback, useState } from "react";
import type { TicketLine } from "@shared/types/Ticket";
import { useAppDispatch } from "../../../app/store";
import { discountStockFefo } from "../../product/helpers/discountStockFefo";
import { useProducts } from "../../product/hooks/useProducts";
import { updateProduct } from "../../product/productThunks";

// El descuento se manda por el endpoint de editar producto, uno por linea del ticket.
// Si alguno falla la venta ya esta hecha: se avisa para corregir el stock a mano
export const useStockDiscount = () => {
    const dispatch = useAppDispatch();
    const { products } = useProducts();
    const [failedProducts, setFailedProducts] = useState<string[]>([]);

    const discountStock = useCallback(
        (lines: TicketLine[]): void => {
            lines.forEach((line) => {
                const product = products.find((item) => item._id === line.productId);

                if (!product) return;

                const discounted = discountStockFefo(product, line.quantity);

                // Sin lotes cargados no hay nada que descontar
                if (discounted === product) return;

                void dispatch(updateProduct(discounted))
                    .unwrap()
                    .catch(() => setFailedProducts((current) => [...current, line.name]));
            });
        },
        [products, dispatch]
    );

    const dismissFailures = useCallback((): void => setFailedProducts([]), []);

    return { failedProducts, discountStock, dismissFailures };
};
