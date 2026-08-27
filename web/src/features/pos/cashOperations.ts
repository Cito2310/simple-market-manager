import type {
    CashCount,
    CashCountEntry,
    CashMovement,
    CashMovementType,
    CashSession
} from "@shared/types/CashSession";
import type { Ticket } from "@shared/types/Ticket";

export const countTotal = (entries: CashCountEntry[], coins: number): number =>
    entries.reduce((total, entry) => total + entry.denomination * entry.quantity, coins);

export const buildCashCount = (entries: CashCountEntry[], coins: number): CashCount => ({
    entries,
    coins,
    total: countTotal(entries, coins),
    countedAt: Date.now()
});

// Todavia no existe el modelo de Shift, se usa la fecha local como identificador provisorio
const currentShiftId = (): string => new Date().toISOString().slice(0, 10);

export const buildCashSession = (opening: CashCount): CashSession => ({
    _id: crypto.randomUUID(),
    shiftId: currentShiftId(),
    openedAt: Date.now(),
    opening,
    movements: []
});

export const buildCashMovement = (
    type: CashMovementType,
    amount: number,
    note: string
): CashMovement => ({
    _id: crypto.randomUUID(),
    type,
    amount,
    note: note.trim() || undefined,
    timestamp: Date.now()
});

export const totalByType = (movements: CashMovement[], type: CashMovementType): number =>
    movements
        .filter((movement) => movement.type === type)
        .reduce((total, movement) => total + movement.amount, 0);

// Solo el efectivo entra en el arqueo: el resto de los medios de pago no toca la caja
export const cashSalesSince = (tickets: Ticket[], from: number): number =>
    tickets
        .filter((ticket) => ticket.timestamp >= from)
        .reduce(
            (total, ticket) =>
                total +
                ticket.payments
                    .filter((payment) => payment.method === "cash")
                    .reduce((sum, payment) => sum + payment.amount, 0),
            0
        );

// Lo que deberia haber en la caja: los tacos no suman porque nunca salieron del cajon
export const expectedCash = (session: CashSession, cashSales: number): number =>
    session.opening.total +
    cashSales +
    totalByType(session.movements, "deposit") -
    totalByType(session.movements, "withdraw");

// Al cerrar, lo contado es el suelto mas los tacos que ya estaban registrados
export const countedAtClose = (session: CashSession): number =>
    (session.closing?.total ?? 0) + totalByType(session.movements, "bundle");
