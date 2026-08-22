import type { Request, Response } from "express";
import { ProductModel } from "../product.model.js";

export const createProduct = async (req: Request, res: Response): Promise<void> => {
    const product = await ProductModel.create(req.body);
    res.status(201).json(product);
};
