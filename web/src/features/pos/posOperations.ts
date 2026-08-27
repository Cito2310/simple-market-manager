import type { Product, Promotion } from "@shared/types/Product";
import type { Payment, Ticket, TicketLine } from "@shared/types/Ticket";

export interface TicketTotals {
    subtotal: number;
    discount: number;
    total: number;
}

// Los importes se redondean a centavos para que las cantidades fraccionadas no arrastren decimales
const roundPrice = (value: number): number => Math.round(value * 100) / 100;

// Los pesables se suman en kilos: tres decimales son los gramos que informa la balanza
const roundQuantity = (value: number): number => Math.round(value * 1000) / 1000;

// La balanza imprime: 20 + PLU de 5 digitos + peso en gramos de 5 digitos + verificador
const SCALE_PREFIX = "20";
const SCALE_CODE_LENGTH = 13;

export interface ScaleCode {
    productCode: string;
    // En kilos, que es la unidad en la que esta cargado el precio del pesable
    weight: number;
}

export const parseScaleBarcode = (barcode: string): ScaleCode | undefined => {
    if (barcode.length !== SCALE_CODE_LENGTH || !barcode.startsWith(SCALE_PREFIX)) return undefined;
    if (!/^[0-9]+$/.test(barcode)) return undefined;

    const grams = Number(barcode.slice(7, 12));

    if (grams <= 0) return undefined;

    // El ultimo digito es el verificador de la balanza: no se valida ni se usa para el match
    return { productCode: barcode.slice(2, 7), weight: roundQuantity(grams / 1000) };
};

// Indice de codigo -> producto: la busqueda corre en cada tecla que manda el lector
export const buildBarcodeIndex = (products: Product[]): Map<string, Product> => {
    const index = new Map<string, Product>();

    for (const product of products) {
        for (const barcode of product.details.barcodes) {
            // Si dos productos comparten un codigo gana el primero, como hacia la busqueda lineal
            if (!index.has(barcode)) index.set(barcode, product);
        }
    }

    return index;
};

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

// Cada escaneo suma una unidad, o el peso de la etiqueta si viene de la balanza: si el producto
// ya está en el ticket se recalcula la línea entera
export const addProductToLines = (
    lines: TicketLine[],
    product: Product,
    quantity = 1
): TicketLine[] => {
    const isInTicket = lines.some((line) => line.productId === product._id);

    if (!isInTicket) return [...lines, buildTicketLine(product, quantity)];

    return lines.map((line) =>
        line.productId === product._id
            ? buildTicketLine(product, roundQuantity(line.quantity + quantity))
            : line
    );
};

export const calculateTotals = (lines: TicketLine[]): TicketTotals => {
    const subtotal = roundPrice(lines.reduce((sum, line) => sum + line.quantity * line.unitPrice, 0));
    const total = roundPrice(lines.reduce((sum, line) => sum + line.total, 0));

    return { subtotal, discount: roundPrice(subtotal - total), total };
};

// Todavía no existe el modelo de Shift, se usa la fecha local como identificador provisorio
const currentShiftId = (): string => new Date().toISOString().slice(0, 10);

export const buildTicket = (lines: TicketLine[], payments: Payment[]): Ticket => {
    const { total } = calculateTotals(lines);

    return {
        _id: crypto.randomUUID(),
        timestamp: Date.now(),
        shiftId: currentShiftId(),
        payments,
        lines,
        total
    };
};
