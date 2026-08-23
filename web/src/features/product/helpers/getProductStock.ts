import type { ProductApi } from "@shared/types/Product";

// El stock es la suma de lo que queda en cada lote
export const getProductStock = (product: ProductApi): number =>
    (product.inventory?.batches ?? []).reduce((total, batch) => total + batch.quantity, 0);
