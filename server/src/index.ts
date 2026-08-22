import express from "express";
import { env } from "./config/env.js";
import { connectDB } from "./config/connectDB.js";
import { categoryRoutes } from "./features/category/category.routes.js";
import { productRoutes } from "./features/product/product.routes.js";

const app = express();

app.use(express.json());

app.get("/", (_req, res) => {
    res.send("OK");
});

app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);

const startServer = async (): Promise<void> => {
    await connectDB();
    app.listen(env.port, () => {
        console.log(`Server running at http://localhost:${env.port}`);
    });
};

startServer();
