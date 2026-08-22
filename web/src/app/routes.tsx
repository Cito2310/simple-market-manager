import { createHashRouter, Navigate } from "react-router-dom";
import { PosPage } from "../features/pos/PosPage";
import { ProductPage } from "../features/product/ProductPage";
import App from "./App";

// Hash router porque la app va a correr en Electron sobre file://
export const router = createHashRouter([
    {
        path: "/",
        element: <App />,
        children: [
            { index: true, element: <Navigate to="/pos" replace /> },
            { path: "pos", element: <PosPage /> },
            { path: "products", element: <ProductPage /> }
        ]
    }
]);
