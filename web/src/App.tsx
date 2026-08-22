import { useInitialData } from "./app/useInitialData";
import { ProductPage } from "./features/product/ProductPage";

const App = () => {
    useInitialData();

    return (
        <div className="min-h-screen bg-slate-50">
            <ProductPage />
        </div>
    );
};

export default App;
