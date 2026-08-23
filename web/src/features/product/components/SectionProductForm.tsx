import type { ReactNode } from "react";

interface props {
    title: string;
    children: ReactNode;
}

// Separa el formulario en los mismos tres bloques que tiene el modelo: Details, Sell e Inventory
export const SectionProductForm = ({ title, children }: props) => (
    <section className="border-b border-slate-200 px-6 py-5 last:border-b-0">
        <h3 className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-400">{title}</h3>
        <div className="grid gap-4 sm:grid-cols-2">{children}</div>
    </section>
);
