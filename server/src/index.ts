import express from "express";
import { env } from "./config/env.js";
import { connectDB } from "./db/connectDB.js";

const app = express();

app.get("/", (_req, res) => {
    res.send("OK");
});

const startServer = async (): Promise<void> => {
    await connectDB();
    app.listen(env.port, () => {
        console.log(`Server running at http://localhost:${env.port}`);
    });
};

startServer();
