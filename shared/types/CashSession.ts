// Billetes que se cuentan en el arqueo, de mayor a menor; las monedas van aparte por monto
export const CASH_DENOMINATIONS = [20000, 10000, 2000, 1000, 500, 200, 100, 50] as const;

export interface CashCountEntry {
    denomination: number;
    quantity: number;
}

// Un arqueo: la foto del efectivo contado en un momento dado
export interface CashCount {
    entries: CashCountEntry[];
    coins: number;
    total: number;
    countedAt: number;
}

// bundle = taco ya contado que sigue en la caja | deposit = ingreso | withdraw = retiro
export const CASH_MOVEMENT_TYPES = ["bundle", "deposit", "withdraw"] as const;

export type CashMovementType = (typeof CASH_MOVEMENT_TYPES)[number];

export interface CashMovement {
    _id: string;
    type: CashMovementType;
    amount: number;
    note?: string;
    timestamp: number;
}

export interface CashSession {
    _id: string;
    shiftId: string;
    openedAt: number;
    opening: CashCount;
    movements: CashMovement[];
    // El arqueo de cierre cuenta solo el efectivo suelto: los tacos ya estan registrados
    closing?: CashCount;
    closedAt?: number;
}
