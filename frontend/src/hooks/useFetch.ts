import { useState } from "react";

interface FetchProps {
    method?: 'GET' | 'POST';
    headers?: HeadersInit;
    body?: any;
}

export function useFetch<T = any>() {
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<String | null>(null);
    const [loading, setLoading] = useState(false);

    const request = async (url: string, options: FetchProps = {}) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(url, {
                method: options.method || 'GET',
                headers: {
                    "Content-Type": "application/json",
                    ...(options.headers || {}),
                },
                body: options.body ? JSON.stringify(options.body) : undefined,
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Request Failed");
            }

            setData(result);
            return result;
        } catch (err: any) {
            setError(err.message || "Something went wrong");
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { data, error, loading, request };
}