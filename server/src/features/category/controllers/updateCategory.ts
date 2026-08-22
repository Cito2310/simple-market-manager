import type { Request, Response } from "express";
import { CategoryModel } from "../category.model.js";

export const updateCategory = async (req: Request, res: Response): Promise<void> => {
    const category = await CategoryModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!category) {
        res.status(404).json({ message: "Category not found" });
        return;
    }
    res.json(category);
};
