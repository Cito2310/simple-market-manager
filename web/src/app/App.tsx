import { HashRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";
import { PosPage } from "../features/pos/PosPage";
import { ProductPage } from "../features/product/ProductPage";
import { TopBar } from "../features/topbar/TopBar";
import { useInitialData } from "./useInitialData";

const Layout = () => {
    useInitialData();

    return (
        <div className="flex h-screen flex-col bg-slate-50">
            <TopBar />
            <main className="min-h-0 flex-1 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    );
};

// Hash router porque la app va a correr en Electron sobre file://
const App = () => (
    <HashRouter>
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<Navigate to="/pos" replace />} />
                <Route path="pos" element={<PosPage />} />
                <Route path="products" element={<ProductPage />} />
            </Route>
        </Routes>
    </HashRouter>
);

export default App;
