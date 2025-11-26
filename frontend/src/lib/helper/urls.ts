import GetBaseUrl from "./getBaseUrl"

export const BaseUrl = `${GetBaseUrl()}api/`

export const LoginUrl = import.meta.env.VITE_API_LOGINURL
export const RegisterUrl = import.meta.env.VITE_API_REGISTERURL

export const ReOrderListURL = import.meta.env.VITE_API_REORDERLISTURL
export const ReOrderCardURL = import.meta.env.VITE_API_REORDERCARDRURL