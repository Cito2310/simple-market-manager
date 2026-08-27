import type { ProductApi } from "@shared/types/Product";
import { formatPrice } from "../../../shared/helpers/formatPrice";
import { formatProductSubtitle } from "../../product/helpers/formatProductSubtitle";
import { getProductStock } from "../../product/helpers/getProductStock";

interface ProductSearchListProps {
    products: ProductApi[];
    hasSearch: boolean;
    hiddenCount: number;
    onSelect: (product: ProductApi) => void;
}

const EmptyMessage = ({ text }: { text: string }) => (
    <p className="px-6 py-10 text-center text-sm text-slate-400">{text}</p>
);

export const ProductSearchList = ({
    products,
    hasSearch,
    hiddenCount,
    onSelect
}: ProductSearchListProps) => {
    if (!hasSearch) return <EmptyMessage text="Escribi para buscar un producto" />;

    if (products.length === 0) return <EmptyMessage text="No se encontraron productos" />;

    return (
        <div>
            <ul className="divide-y divide-slate-100">
                {products.map((product) => (
                    <li key={product._id}>
                        {/* Toda la fila es el boton: es un click grande, comodo con el cliente esperando */}
                        <button
                            type="button"
                            onClick={() => onSelect(product)}
                            className="flex w-full items-center gap-4 px-6 py-3 text-left transition hover:bg-slate-50"
                        >
                            <span className="min-w-0 flex-1">
                                <span className="block truncate font-medium capitalize text-slate-900">
                                    {product.details.brand} {product.details.name}
                                </span>
                                <span className="block truncate text-xs capitalize text-slate-500">
                                    {formatProductSubtitle(product)}
                                </span>
                            </span>

                            <span className="shrink-0 text-xs text-slate-500">
                                Stock {getProductStock(product)}
                            </span>

                            <span className="w-24 shrink-0 text-right font-medium tabular-nums text-slate-900">
                                {formatPrice(product.sell.salePrice)}
                            </span>
                        </button>
                    </li>
                ))}
            </ul>

            {hiddenCount > 0 && (
                <p className="px-6 py-3 text-center text-xs text-slate-400">
                    {hiddenCount} resultados mas: afina la busqueda
                </p>
            )}
        </div>
    );
};
