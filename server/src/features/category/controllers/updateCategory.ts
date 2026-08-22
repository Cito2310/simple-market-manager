import type { Request, Response } from "express";
import { CategoryModel } from "../category.model.js";

export const updateCategory = async (req: Request, res: Response): Promise<void> => {
    const category = await CategoryModel.findById(req.params.id);
    if (!category) {
        res.status(404).json({ message: "Category not found" });
        return;
    }

    // Los campos que maneja el server nunca se toman del body
    const { _id, __v, createdBy, createdAt, updatedAt, ...incoming } = req.body;

    // Rechaza ediciones hechas sobre una versión que ya no es la actual
    if (__v !== undefined && __v !== category.__v) {
        res.status(409).json({ message: "Category was modified by someone else" });
        return;
    }

    category.overwrite({ ...incoming, createdBy: category.createdBy });
    await category.save();
    res.json(category);
};
