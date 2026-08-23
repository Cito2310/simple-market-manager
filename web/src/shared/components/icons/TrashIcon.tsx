interface props {
    className?: string;
}

export const TrashIcon = ({ className = "h-4 w-4" }: props) => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        aria-hidden="true"
    >
        <path d="M3 6h18" />
        <path d="M8 6V4h8v2" />
        <path d="M18.5 6 17.5 20H6.5L5.5 6" />
        <path d="M10 11v5M14 11v5" />
    </svg>
);
