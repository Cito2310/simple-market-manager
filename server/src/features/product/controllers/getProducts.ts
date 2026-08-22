import type { Request, Response } from "express";
import { ProductModel } from "../product.model.js";

export const getProducts = async (_req: Request, res: Response): Promise<void> => {
    const products = await ProductModel.find();
    res.json(products);
};
