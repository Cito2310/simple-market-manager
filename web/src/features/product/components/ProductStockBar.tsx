import type { ProductApi } from "@shared/types/Product";
import { getProductStockLevel } from "../helpers/getProductStockLevel";
import type { StockTone } from "../helpers/getProductStockLevel";

interface props {
    product: ProductApi;
}

const fillClass: Record<StockTone, string> = {
    empty: "bg-red-900",
    critical: "bg-red-500",
    low: "bg-orange-500",
    warning: "bg-amber-400",
    ok: "bg-emerald-500"
};

export const ProductStockBar = ({ product }: props) => {
    const { stock, percent, tone, warning, hasThreshold } = getProductStockLevel(product);

    if (!hasThreshold) {
        return <span className="tabular-nums text-slate-400">{stock}</span>;
    }

    return (
        <div
            className="flex flex-col items-center gap-1"
            title={`Stock ${stock} · aviso en ${warning}`}
        >
            {/* Sin stock el relleno mide 0 y no se veria, asi que se pinta la pista entera */}
            <div
                className={`h-2 w-20 shrink-0 overflow-hidden rounded-full ${
                    tone === "empty" ? "bg-red-900" : "bg-slate-100"
                }`}
            >
                <div className={`h-full rounded-full ${fillClass[tone]}`} style={{ width: `${percent}%` }} />
            </div>
            <span className="text-xs tabular-nums text-slate-600">{stock}</span>
        </div>
    );
};
