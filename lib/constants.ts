export const VIVO_LOGO = "/images/vivo.jpg";
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
export const API_USERNAME = process.env.NEXT_PUBLIC_API_USERNAME;
export const API_PASSWORD = process.env.NEXT_PUBLIC_API_PASSWORD;
export const API_AUTHORIZATION = `Basic ${btoa(`${API_USERNAME}:${API_PASSWORD}`)}`;