export default function GetBaseUrl(): string {
    if (import.meta.env.VITE_API_BASEURL) return import.meta.env.VITE_API_BASEURL;

    return "http://127.0.0.1:8000/"
}