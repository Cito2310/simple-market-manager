import type { ReactNode } from "react";
import { useEscapeKey } from "../hooks/useEscapeKey";

interface ModalProps {
    title: string;
    onClose: () => void;
    children: ReactNode;
}

export const Modal = ({ title, onClose, children }: ModalProps) => {
    useEscapeKey(onClose);

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/40 p-4 sm:p-8">
            <div className="w-full max-w-2xl rounded-xl bg-white shadow-xl">
                <header className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
                    <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Cerrar"
                        className="rounded p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                    >
                        &#10005;
                    </button>
                </header>
                {children}
            </div>
        </div>
    );
};
