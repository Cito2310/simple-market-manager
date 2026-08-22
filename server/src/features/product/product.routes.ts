import { Router } from "express";
import { getProducts } from "./controllers/getProducts.js";
import { createProduct } from "./controllers/createProduct.js";
import { updateProduct } from "./controllers/updateProduct.js";
import { deleteProduct } from "./controllers/deleteProduct.js";

export const productRoutes = Router();

productRoutes.get("/", getProducts);
productRoutes.post("/", createProduct);
productRoutes.put("/:id", updateProduct);
productRoutes.delete("/:id", deleteProduct);