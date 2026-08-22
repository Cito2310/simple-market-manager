import { body } from "express-validator";
import type { ValidationChain } from "express-validator";

interface StringRulesOptions {
    min?: number;
    max: number;
    lowercase?: boolean;
}

const lengthMessage = (label: string, min: number, max: number): string =>
    min > 1
        ? `${label} must be between ${min} and ${max} characters`
        : `${label} must be at most ${max} characters`;

// Valida el tipo, normaliza el texto y recien ahi mide el largo, para que un "  a  " falle por corto
export const stringRules = (
    field: string,
    label: string,
    { min = 1, max, lowercase = true }: StringRulesOptions
): ValidationChain => {
    const chain = body(field)
        .isString()
        .withMessage(`${label} must be a string`)
        .bail()
        .trim();

    return (lowercase ? chain.toLowerCase() : chain)
        .isLength({ min, max })
        .withMessage(lengthMessage(label, min, max));
};
