import type { Batch, ProductApi } from "@shared/types/Product";

// Las cantidades fraccionadas de los pesables no deben arrastrar decimales del punto flotante
const roundQuantity = (value: number): number => Math.round(value * 1000) / 1000;

// FEFO: sale primero el lote que vence antes; los que no tienen vencimiento quedan al final
const expirationTime = (batch: Batch): number =>
    batch.expirationDate ? new Date(batch.expirationDate).getTime() : Number.POSITIVE_INFINITY;

// Descuenta la cantidad vendida repartiendola entre los lotes. Si el stock registrado no
// alcanza, los lotes quedan en cero: el server no acepta cantidades negativas
export const discountStockFefo = (product: ProductApi, quantity: number): ProductApi => {
    const inventory = product.inventory;

    if (!inventory || inventory.batches.length === 0 || quantity <= 0) return product;

    let pending = quantity;

    const discounted = [...inventory.batches]
        .sort((first, second) => expirationTime(first) - expirationTime(second))
        .map((batch) => {
            if (pending <= 0) return batch;

            const taken = Math.min(batch.quantity, pending);
            pending = roundQuantity(pending - taken);

            return { ...batch, quantity: roundQuantity(batch.quantity - taken) };
        })
        // El lote agotado se saca: si no, su vencimiento seguiria figurando como el proximo
        .filter((batch) => batch.quantity > 0);

    return { ...product, inventory: { ...inventory, batches: discounted } };
};
