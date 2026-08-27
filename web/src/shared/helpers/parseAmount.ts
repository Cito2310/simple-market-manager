// Los montos se cargan como texto libre: lo que no sea un numero valido cuenta como cero
export const parseAmount = (value: string): number => {
    const amount = Number(value.trim().replace(",", "."));

    return Number.isFinite(amount) && amount > 0 ? amount : 0;
};
