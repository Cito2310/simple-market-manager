import type { Request, Response } from "express";
import { CategoryModel } from "../category.model.js";

export const createCategory = async (req: Request, res: Response): Promise<void> => {
    const category = await CategoryModel.create(req.body);
    res.status(201).json(category);
};
