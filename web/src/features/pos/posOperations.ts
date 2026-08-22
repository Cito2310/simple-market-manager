import type { Product, Promotion } from "@shared/types/Product";
import type { Ticket, TicketLine } from "@shared/types/Ticket";

export interface TicketTotals {
    subtotal: number;
    discount: number;
    total: number;
}

// Los importes se redondean a centavos para que las cantidades fraccionadas no arrastren decimales
const roundPrice = (value: number): number => Math.round(value * 100) / 100;

export const findProductByBarcode = (products: Product[], barcode: string): Product | undefined =>
    products.find((product) => product.details.barcodes.includes(barcode));

// De las promociones que la cantidad alcanza se aplica la más conveniente para el cliente
export const pickPromotion = (promotions: Promotion[], quantity: number): Promotion | undefined =>
    promotions
        .filter((promotion) => quantity >= promotion.minQuantity)
        .reduce<Promotion | undefined>(
            (best, promotion) => (!best || promotion.pricePerUnit < best.pricePerUnit ? promotion : best),
            undefined
        );

export const buildTicketLine = (product: Product, quantity: number): TicketLine => {
    const appliedPromotion = pickPromotion(product.sell.promotions ?? [], quantity);
    const unitPrice = product.sell.salePrice;

    return {
        productId: product._id,
        name: product.details.name,
        quantity,
        // Solo los pesables miden la cantidad con la unidad del producto, el resto va por unidades sueltas
        sizeUnit: product.sell.weighable ? product.details.sizeUnit : "unit",
        cost: product.sell.cost,
        unitPrice,
        appliedPromotion,
        total: roundPrice(quantity * (appliedPromotion?.pricePerUnit ?? unitPrice))
    };
};

// Cada escaneo suma una unidad: si el producto ya está en el ticket se recalcula la línea entera
export const addProductToLines = (lines: TicketLine[], product: Product): TicketLine[] => {
    const isInTicket = lines.some((line) => line.productId === product._id);

    if (!isInTicket) return [...lines, buildTicketLine(product, 1)];

    return lines.map((line) =>
        line.productId === product._id ? buildTicketLine(product, line.quantity + 1) : line
    );
};

export const calculateTotals = (lines: TicketLine[]): TicketTotals => {
    const subtotal = roundPrice(lines.reduce((sum, line) => sum + line.quantity * line.unitPrice, 0));
    const total = roundPrice(lines.reduce((sum, line) => sum + line.total, 0));

    return { subtotal, discount: roundPrice(subtotal - total), total };
};

// Todavía no existe el modelo de Shift, se usa la fecha local como identificador provisorio
const currentShiftId = (): string => new Date().toISOString().slice(0, 10);

export const buildTicket = (lines: TicketLine[]): Ticket => {
    const { total } = calculateTotals(lines);

    return {
        _id: crypto.randomUUID(),
        timestamp: Date.now(),
        shiftId: currentShiftId(),
        // Sin modal de cobro todavía se asume el pago completo en efectivo
        payments: [{ method: "cash", amount: total }],
        lines,
        total
    };
};
