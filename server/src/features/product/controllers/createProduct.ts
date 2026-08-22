import type { Request, Response } from "express";
import type { ProductInput } from "../../../../../shared/types/Product.js";
import { ProductModel } from "../product.model.js";

export const createProduct = async (
    req: Request<Record<string, string>, unknown, ProductInput>,
    res: Response
): Promise<void> => {
    const product = await ProductModel.create(req.body);
    res.status(201).json(product);
};
