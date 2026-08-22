import { Outlet } from "react-router-dom";
import { TopBar } from "../features/topbar/TopBar";
import { useInitialData } from "./useInitialData";

const App = () => {
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

export default App;
