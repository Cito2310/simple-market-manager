import { useCallback, useState } from "react";
import type { Product } from "@shared/types/Product";
import type { TicketLine } from "@shared/types/Ticket";
import { addProductToLines } from "../posOperations";

export const useTicketLines = () => {
    const [lines, setLines] = useState<TicketLine[]>([]);

    const addProduct = useCallback((product: Product, quantity = 1): void => {
        setLines((current) => addProductToLines(current, product, quantity));
    }, []);

    const removeLine = useCallback((productId: string): void => {
        setLines((current) => current.filter((line) => line.productId !== productId));
    }, []);

    const clearLines = useCallback((): void => setLines([]), []);

    return { lines, addProduct, removeLine, clearLines };
};
