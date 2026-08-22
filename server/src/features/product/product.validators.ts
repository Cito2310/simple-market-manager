import { body, param } from "express-validator";
import { SIZE_UNITS } from "../../../../shared/types/Product.js";
import type { Promotion } from "../../../../shared/types/Product.js";
import { stringRules } from "../../helpers/validationRules.js";

const NAME_OPTIONS = { min: 2, max: 60 };

// Hay productos cargados con "-" como marca cuando no tienen una
const BRAND_OPTIONS = { min: 1, max: 50 };

const CATEGORY_OPTIONS = { min: 2, max: 50 };

// Cubre desde EAN-8 hasta los codigos largos que imprime la balanza
const BARCODE_OPTIONS = { min: 4, max: 24 };

const hasUniqueValues = (values: unknown[]): boolean => new Set(values).size === values.length;

export const idRules = param("id").isMongoId().withMessage("Invalid product id");

export const productRules = [
    stringRules("details.name", "Name", NAME_OPTIONS),
    stringRules("details.brand", "Brand", BRAND_OPTIONS),
    stringRules("details.category", "Category", CATEGORY_OPTIONS),
    stringRules("details.subcategory", "Subcategory", CATEGORY_OPTIONS),
    body("details.barcodes").optional().isArray().withMessage("Barcodes must be an array"),
    stringRules("details.barcodes.*", "Barcode", BARCODE_OPTIONS),
    body("details.barcodes")
        .optional()
        .custom((barcodes: string[]) => hasUniqueValues(barcodes))
        .withMessage("Barcodes must be unique inside the product"),
    body("details.size").isFloat({ gt: 0 }).withMessage("Size must be greater than 0"),
    body("details.sizeUnit")
        .isIn(SIZE_UNITS)
        .withMessage(`Size unit must be one of: ${SIZE_UNITS.join(", ")}`),

    body("sell.cost").isFloat({ min: 0 }).withMessage("Cost must be 0 or greater"),
    body("sell.salePrice").isFloat({ min: 0 }).withMessage("Sale price must be 0 or greater"),
    body("sell.weighable").optional().isBoolean().withMessage("Weighable must be a boolean"),
    body("sell.promotions").optional().isArray().withMessage("Promotions must be an array"),
    body("sell.promotions.*.minQuantity")
        .isFloat({ min: 1 })
        .withMessage("Promotion min quantity must be 1 or greater"),
    body("sell.promotions.*.pricePerUnit")
        .isFloat({ min: 0 })
        .withMessage("Promotion price per unit must be 0 or greater"),

    // Con dos promociones del mismo minimo no hay forma de decidir cual gana
    body("sell.promotions")
        .optional()
        .custom((promotions: Promotion[]) =>
            hasUniqueValues(promotions.map((promotion) => promotion.minQuantity))
        )
        .withMessage("Promotions must have a different min quantity"),

    // Una promo mas cara que el precio de lista le subiria el total al cliente en la caja
    body("sell.promotions")
        .optional()
        .custom((promotions: Promotion[], { req }) => {
            const salePrice = Number(req.body?.sell?.salePrice);
            return promotions.every((promotion) => promotion.pricePerUnit <= salePrice);
        })
        .withMessage("Promotion price per unit must not be greater than the sale price"),

    body("inventory").optional().isObject().withMessage("Inventory must be an object"),
    body("inventory.batches").optional().isArray().withMessage("Batches must be an array"),
    body("inventory.batches.*.quantity")
        .isFloat({ min: 0 })
        .withMessage("Batch quantity must be 0 or greater"),
    body("inventory.batches.*.expirationDate")
        .optional()
        .isISO8601()
        .withMessage("Batch expiration date must be a valid date"),
    body("inventory.batches.*.receivedAt")
        .optional()
        .isISO8601()
        .withMessage("Batch received date must be a valid date"),
    body("inventory.alerts.enabled").optional().isBoolean().withMessage("Alerts enabled must be a boolean"),
    body("inventory.alerts.warning")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Alerts warning must be 0 or greater"),
    body("inventory.alerts.low").optional().isFloat({ min: 0 }).withMessage("Alerts low must be 0 or greater"),
    body("inventory.alerts.critical")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Alerts critical must be 0 or greater"),

    body("active").optional().isBoolean().withMessage("Active must be a boolean")
];
