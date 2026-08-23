import type { ReactNode } from "react";
import { useEscapeKey } from "../hooks/useEscapeKey";

export type ModalButtonType = "primary" | "secondary" | "danger";

export interface ModalButton {
    label: string;
    type?: ModalButtonType;
    onClick?: () => void;
    disabled?: boolean;
    className?: string;
    // Id del form que envia: el boton vive fuera del <form>, asi que lo apunta por atributo
    form?: string;
}

interface ModalProps {
    title: string;
    onClose: () => void;
    children: ReactNode;
    footerButtons?: ModalButton[];
}

const buttonBaseClass = "rounded-md min-w-32 px-4 py-2 text-sm font-medium transition disabled:opacity-50";

const buttonTypeClass: Record<ModalButtonType, string> = {
    primary: "bg-slate-900 text-white hover:bg-slate-700",
    secondary: "text-slate-600 hover:bg-slate-100",
    danger: "bg-red-600 text-white hover:bg-red-700"
};

export const Modal = ({ title, onClose, children, footerButtons }: ModalProps) => {
    useEscapeKey(onClose);

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/40 p-4 sm:p-8">
            <div className="flex max-h-[85vh] w-full max-w-2xl flex-col rounded-xl bg-white shadow-xl">
                <header className="flex shrink-0 items-center justify-between border-b border-slate-200 px-6 py-4">
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

                {/* Lo unico que scrollea: el header y el footer quedan siempre a la vista */}
                <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>

                {footerButtons && footerButtons.length > 0 && (
                    <footer className="flex shrink-0 justify-end gap-3 border-t border-slate-200 px-6 py-4">
                        {footerButtons.map((button, index) => (
                            <button
                                key={index}
                                type={button.form ? "submit" : "button"}
                                form={button.form}
                                onClick={button.onClick}
                                disabled={button.disabled}
                                className={`${buttonBaseClass} ${buttonTypeClass[button.type ?? "secondary"]} ${
                                    button.className ?? ""
                                }`}
                            >
                                {button.label}
                            </button>
                        ))}
                    </footer>
                )}
            </div>
        </div>
    );
};
