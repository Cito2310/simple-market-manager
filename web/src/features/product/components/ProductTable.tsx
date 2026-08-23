import { ProductApi } from "@shared/types/Product"
import { formatProductSubtitle } from "../helpers/formatProductSubtitle"
import { formatProductExpiration } from "../helpers/formatProductExpiration"
import { ProductStockBar } from "./ProductStockBar"
import { formatPrice } from "../../../shared/helpers/formatPrice"
import { PenIcon } from "../../../shared/components/icons/PenIcon"
import { TrashIcon } from "../../../shared/components/icons/TrashIcon"

interface props {
    products: ProductApi[]
    openEdit: (product: ProductApi) => void
    requestDelete: (product: ProductApi) => void
}

export const ProductTable = ({ products, openEdit, requestDelete }: props) => (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
        {/* HEAD TABLE */}
        <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
                <tr>
                    <th className="px-4 py-3 font-medium">Producto</th>
                    <th className="px-4 py-3 font-medium text-center">Categoria</th>
                    <th className="px-4 py-3 font-medium text-center">Vencimiento</th>
                    <th className="px-4 py-3 text-center font-medium">Stock</th>
                    <th className="px-4 py-3 text-right font-medium">Precio</th>
                    <th className="px-4 py-3" />
                </tr>
            </thead>

        {/* ITEM TABLE */}
            <tbody className="divide-y divide-slate-100">
                {products.map((product) => {
                    const expiration = formatProductExpiration(product)

                    return (
                        <tr key={product._id} className="text-slate-700">
                            <td className="px-4 py-3">
                                <span className="block font-medium capitalize text-slate-900">
                                    {product.details.brand + " " + product.details.name}
                                </span>
                                <span className="block text-xs capitalize text-slate-500">
                                    {formatProductSubtitle(product)}
                                </span>
                            </td>
                            <td className="px-4 py-3 text-center">
                                <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium capitalize text-slate-600">
                                    {product.details.category}
                                </span>
                            </td>
                            <td
                                className={`px-4 py-3 text-center ${
                                    expiration.isUrgent ? "font-medium text-red-600" : "text-slate-500"
                                }`}
                            >
                                {expiration.text}
                            </td>
                            <td className="px-4 py-3 text-center">
                                <ProductStockBar product={product} />
                            </td>
                            <td className="px-4 py-3 text-right tabular-nums">{formatPrice(product.sell.salePrice)}</td>
                            <td className="px-4 py-3 text-right">
                                <div className="flex justify-end gap-1">
                                    <button
                                        type="button"
                                        onClick={() => openEdit(product)}
                                        aria-label="Editar producto"
                                        title="Editar"
                                        className="rounded p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                                    >
                                        <PenIcon />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => requestDelete(product)}
                                        aria-label="Eliminar producto"
                                        title="Eliminar"
                                        className="rounded p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                                    >
                                        <TrashIcon />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
    </div>
)