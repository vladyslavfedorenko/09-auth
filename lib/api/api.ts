import axios from "axios";

/**
 * ВАЖНО:
 * - теперь мы НЕ ходим напрямую на бекенд
 * - все запросы идут через Next.js API (/api)
 * - авторизация работает через cookies
 */

const baseURL = process.env.NEXT_PUBLIC_API_URL + "/api";

export const api = axios.create({
  baseURL,
  withCredentials: true, // 👈 КРИТИЧЕСКИ ВАЖНО для cookies
});
