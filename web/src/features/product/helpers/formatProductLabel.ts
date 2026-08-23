import { ProductApi } from "@shared/types/Product"

export const formatProductLabel = (product: ProductApi) => {
    const { brand, name, size, sizeUnit } = product.details
    return (`${brand} ${name} ${size}${sizeUnit}`)
}