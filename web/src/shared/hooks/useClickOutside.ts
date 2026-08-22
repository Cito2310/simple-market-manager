import { useEffect } from "react";
import type { RefObject } from "react";

export const useClickOutside = <T extends HTMLElement>(
    ref: RefObject<T>,
    onOutside: () => void
): void => {
    useEffect(() => {
        const handleMouseDown = (event: MouseEvent): void => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                onOutside();
            }
        };
        window.addEventListener("mousedown", handleMouseDown);
        return () => window.removeEventListener("mousedown", handleMouseDown);
    }, [ref, onOutside]);
};
