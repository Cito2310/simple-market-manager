import { Router } from "express";
import { getCategories } from "./controllers/getCategories.js";
import { createCategory } from "./controllers/createCategory.js";
import { updateCategory } from "./controllers/updateCategory.js";
import { deleteCategory } from "./controllers/deleteCategory.js";

export const categoryRoutes = Router();

categoryRoutes.get("/", getCategories);
categoryRoutes.post("/", createCategory);
categoryRoutes.put("/:id", updateCategory);
categoryRoutes.delete("/:id", deleteCategory);
