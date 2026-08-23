import type { ProductApi } from "@shared/types/Product";


// Linea secundaria de la fila: lo que acompania al nombre sin competir con el
export const formatProductSubtitle = (product: ProductApi): string => {
    const {  subcategory, size, sizeUnit } = product.details;

    return [subcategory, `${size}${sizeUnit}`]
        .filter(Boolean)
        .join(" · ");
};
