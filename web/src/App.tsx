import { useInitialData } from "./app/useInitialData";
import { PosPage } from "./features/pos/PosPage";
import { ProductPage } from "./features/product/ProductPage";

const App = () => {
    useInitialData();

    return (
        <div className="min-h-screen bg-slate-50">
            <PosPage />
        </div>
    );
};

export default App;
