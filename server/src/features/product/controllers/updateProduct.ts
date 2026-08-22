import type { Request, Response } from "express";
import type { ProductApi } from "../../../../../shared/types/Product.js";
import { ProductModel } from "../product.model.js";

// El front manda el producto completo, con _id y __v incluidos
export const updateProduct = async (
    req: Request<{ id: string }, unknown, ProductApi>,
    res: Response
): Promise<void> => {
    const product = await ProductModel.findById(req.params.id);
    if (!product) {
        res.status(404).json({ message: "Product not found" });
        return;
    }

    // Los campos que maneja el server nunca se toman del body
    const { _id, __v, createdBy, createdAt, updatedAt, ...incoming } = req.body;

    // Rechaza ediciones hechas sobre una versión que ya no es la actual
    if (__v !== undefined && __v !== product.__v) {
        res.status(409).json({ message: "Product was modified by someone else" });
        return;
    }

    product.overwrite({ ...incoming, createdBy: product.createdBy });
    await product.save();
    res.json(product);
};
