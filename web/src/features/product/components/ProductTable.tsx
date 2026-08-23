import { ProductApi } from "@shared/types/Product"
import { formatProductLabel } from "../helpers/formatProductLabel"

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
                    <th className="px-4 py-3 font-medium">Marca</th>
                    <th className="px-4 py-3 font-medium">Categoria</th>
                    <th className="px-4 py-3 text-right font-medium">Precio</th>
                    <th className="px-4 py-3" />
                </tr>
            </thead>

        {/* ITEM TABLE */}
            <tbody className="divide-y divide-slate-100">
                {products.map((product) => (
                    <tr key={product._id} className="text-slate-700">
                        <td className="px-4 py-3 capitalize">{formatProductLabel(product)}</td>
                        <td className="px-4 py-3 capitalize">{product.details.brand}</td>
                        <td className="px-4 py-3 capitalize">{product.details.category}</td>
                        <td className="px-4 py-3 text-right tabular-nums">${product.sell.salePrice}</td>
                        <td className="px-4 py-3 text-right">
                            <div className="flex justify-end gap-1">
                                <button
                                    type="button"
                                    onClick={() => openEdit(product)}
                                    className="rounded px-2 py-1 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                                >
                                    Editar
                                </button>
                                <button
                                    type="button"
                                    onClick={() => requestDelete(product)}
                                    className="rounded px-2 py-1 text-sm font-medium text-red-600 transition hover:bg-red-50 hover:text-red-700"
                                >
                                    Eliminar
                                </button>
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
)