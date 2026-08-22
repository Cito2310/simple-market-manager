import type { Request, Response } from "express";
import { ProductModel } from "../product.model.js";

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
    const product = await ProductModel.findById(req.params.id);
    if (!product) {
        res.status(404).json({ message: "Product not found" });
        return;
    }

    // Server-owned fields are never taken from the request body
    const { _id, __v, createdBy, createdAt, updatedAt, ...incoming } = req.body;

    // Reject edits based on a version of the document that is no longer current
    if (__v !== undefined && __v !== product.__v) {
        res.status(409).json({ message: "Product was modified by someone else" });
        return;
    }

    product.overwrite({ ...incoming, createdBy: product.createdBy });
    await product.save();
    res.json(product);
};
