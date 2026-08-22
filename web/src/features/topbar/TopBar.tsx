import { NavLink } from "react-router-dom";

const LINKS = [
    { to: "/pos", label: "Caja" },
    { to: "/products", label: "Productos" }
];

// El link activo se marca con el subrayado, no con un fondo, para no robarle atencion a la caja
const linkClass = (isActive: boolean): string =>
    `inline-flex min-w-24 items-center justify-center border-b-2 text-sm font-medium transition ${
        isActive
            ? "border-slate-900 text-slate-900"
            : "border-transparent text-slate-500 hover:text-slate-800"
    }`;

export const TopBar = () => (
    // <nav className="h-10 flex shrink-0 items-center gap-6 border-b border-slate-200 bg-white px-6">
    <nav className="flex justify-between px-6 h-8 items-center border-b border-slate-200 bg-white">
        <div className="flex h-full gap-2">
            {LINKS.map((link) => (
                <NavLink key={link.to} to={link.to} className={({ isActive }) => linkClass(isActive)}>
                    {link.label}
                </NavLink>
            ))}
        </div>
        
        <div className="flex gap-6 text-sm font-medium text-slate-500">
            <p>Administrador</p>
            <button>Out -</button>
        </div>
    </nav>
);
