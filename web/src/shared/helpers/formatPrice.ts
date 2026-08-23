export const formatPrice = (value: number): string =>
    value.toLocaleString("es-AR", { style: "currency", currency: "ARS" });
