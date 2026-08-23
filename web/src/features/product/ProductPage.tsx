import { ConfirmDialog } from "../../shared/components/ConfirmDialog";
import { ModalProductForm } from "./components/ModalProductForm";
import { ProductTable } from "./components/ProductTable";
import { useProductPage } from "./hooks/useProductPage";

export const ProductPage = () => {
    const {
        products,
        status,
        error,
        isModalOpen,
        editing,
        openCreate,
        openEdit,
        closeModal,
        deleteTarget,
        isDeleting,
        deleteError,
        requestDelete,
        cancelDelete,
        confirmDelete
    } = useProductPage();

    return (
        <section className="mx-auto w-full max-w-5xl px-6 py-10">
            <header className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold capitalize text-slate-900">productos</h1>
                    <span className="text-sm text-slate-500">
                        {products.length} {products.length === 1 ? "producto" : "productos"}
                    </span>
                </div>
                <button
                    type="button"
                    onClick={openCreate}
                    className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
                >
                    Nuevo producto
                </button>
            </header>

            {status === "loading" && (
                <p className="rounded-lg border border-slate-200 bg-white px-4 py-8 text-center text-slate-500">
                    Cargando productos...
                </p>
            )}

            {status === "failed" && (
                <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-8 text-center text-red-700">
                    No se pudieron cargar los productos: {error}
                </p>
            )}

            {status === "succeeded" && products.length === 0 && (
                <p className="rounded-lg border border-dashed border-slate-300 bg-white px-4 py-12 text-center text-slate-500">
                    Todavia no hay productos cargados.
                </p>
            )}

            {status === "succeeded" && products.length > 0 && ( <ProductTable openEdit={openEdit} products={products} requestDelete={requestDelete} /> )}

            {isModalOpen && <ModalProductForm product={editing} onClose={closeModal} />}

            {deleteTarget && (
                <ConfirmDialog
                    title="Eliminar producto"
                    confirmLabel="Eliminar"
                    isSubmitting={isDeleting}
                    error={deleteError}
                    onConfirm={confirmDelete}
                    onCancel={cancelDelete}
                    message={
                        <>
                            Vas a eliminar <span className="font-medium capitalize text-slate-900">{deleteTarget.details.name}</span>
                            {" "}de <span className="capitalize">{deleteTarget.details.brand}</span>. Esta accion no se puede deshacer.
                        </>
                    }
                />
            )}
        </section>
    );
};
