export const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

// El server responde siempre JSON, pero un proxy caido o un crash pueden devolver otra cosa
const parseBody = (text: string): unknown => {
    try {
        return text ? JSON.parse(text) : undefined;
    } catch {
        return undefined;
    }
};

const errorMessage = (body: unknown, status: number): string => {
    const message = (body as { message?: unknown } | undefined)?.message;
    return typeof message === "string" ? message : `Error ${status}`;
};

export const request = async <T>(path: string, init?: RequestInit): Promise<T> => {
    const response = await fetch(`${API_URL}${path}`, {
        headers: { "Content-Type": "application/json" },
        ...init
    });
    const body = parseBody(await response.text());

    if (!response.ok) {
        throw new Error(errorMessage(body, response.status));
    }
    return body as T;
};
