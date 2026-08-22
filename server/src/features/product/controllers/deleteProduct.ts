import type { Request, Response } from "express";
import { ProductModel } from "../product.model.js";

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
    const product = await ProductModel.findByIdAndDelete(req.params.id);
    if (!product) {
        res.status(404).json({ message: "Product not found" });
        return;
    }
    res.status(204).send();
};
