import { Router } from "express";
import { createdByRules, updatedByRules } from "../../helpers/validationRules.js";
import { checkFields } from "../../middlewares/checkFields.js";
import { idRules, productRules } from "./product.validators.js";
import { getProducts } from "./controllers/getProducts.js";
import { createProduct } from "./controllers/createProduct.js";
import { updateProduct } from "./controllers/updateProduct.js";
import { deleteProduct } from "./controllers/deleteProduct.js";


export const productRoutes = Router();


productRoutes.get("/", getProducts);


productRoutes.post("/", [
    ...productRules,
    createdByRules,
    updatedByRules,
    checkFields
], createProduct);


productRoutes.put("/:id", [
    idRules,
    ...productRules,
    updatedByRules,
    checkFields
], updateProduct);


productRoutes.delete("/:id", [
    idRules,
    checkFields
], deleteProduct);
