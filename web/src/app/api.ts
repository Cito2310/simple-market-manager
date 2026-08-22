export const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

export const request = async <T>(path: string, init?: RequestInit): Promise<T> => {
    const response = await fetch(`${API_URL}${path}`, {
        headers: { "Content-Type": "application/json" },
        ...init
    });
    const text = await response.text();

    if (!response.ok) {
        // El server todavía responde los errores de validación con HTML, así que caemos al status
        try {
            throw new Error(JSON.parse(text).message ?? `Error ${response.status}`);
        } catch (error) {
            throw error instanceof SyntaxError ? new Error(`Error ${response.status}`) : error;
        }
    }
    return text ? JSON.parse(text) : (undefined as T);
};
