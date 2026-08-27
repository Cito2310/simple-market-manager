import type { ProductApi } from "@shared/types/Product";
import { Modal } from "../../../shared/components/Modal";
import { useProductSearch } from "../hooks/useProductSearch";
import { ProductSearchList } from "./ProductSearchList";

interface ProductSearchModalProps {
    onSelect: (product: ProductApi) => void;
    onClose: () => void;
}

export const ProductSearchModal = ({ onSelect, onClose }: ProductSearchModalProps) => {
    const { inputRef, search, results, hasSearch, hiddenCount, changeSearch, selectProduct } =
        useProductSearch(onSelect);

    return (
        <Modal
            title="Buscar productos"
            onClose={onClose}
            footerButtons={[{ label: "Listo", type: "primary", onClick: onClose }]}
        >
            {/* El buscador queda fijo arriba: la lista scrollea debajo */}
            <div className="sticky top-0 z-10 border-b border-slate-200 bg-white px-6 py-4">
                <input
                    ref={inputRef}
                    value={search}
                    onChange={(event) => changeSearch(event.target.value)}
                    autoFocus
                    autoComplete="off"
                    className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-500"
                    placeholder="Buscar por nombre, marca o codigo..."
                />
            </div>

            <ProductSearchList
                products={results}
                hasSearch={hasSearch}
                hiddenCount={hiddenCount}
                onSelect={selectProduct}
            />
        </Modal>
    );
};
