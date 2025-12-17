import axios from "axios";
import { cookies } from "next/headers";
import type { Note } from "@/types/note";
import type { User } from "@/types/user";

/**
 * serverApi используется ТОЛЬКО в серверных компонентах (SSR)
 * Здесь мы обязаны вручную пробрасывать cookies
 */

const baseURL = process.env.NEXT_PUBLIC_API_URL + "/api";

const serverApi = axios.create({
  baseURL,
});

/**
 * Хелпер для отримання cookies у форматі HTTP header
 */
function getCookieHeader() {
  return cookies().toString();
}

/* ===================== NOTES (SSR) ===================== */

interface FetchNotesParams {
  search?: string;
  page?: number;
  tag?: string;
}

interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export async function fetchNotes(
  params: FetchNotesParams
): Promise<FetchNotesResponse> {
  const response = await serverApi.get<FetchNotesResponse>("/notes", {
    params,
    headers: {
      Cookie: getCookieHeader(),
    },
  });

  return response.data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const response = await serverApi.get<Note>(`/notes/${id}`, {
    headers: {
      Cookie: getCookieHeader(),
    },
  });

  return response.data;
}

/* ===================== AUTH / USER (SSR) ===================== */

/**
 * Перевірка активної сесії
 * - повертає User, якщо авторизований
 * - повертає null, якщо ні
 */
export async function checkSession(): Promise<User | null> {
  try {
    const response = await serverApi.get<User>("/auth/session", {
      headers: {
        Cookie: getCookieHeader(),
      },
    });

    return response.data ?? null;
  } catch {
    return null;
  }
}

/**
 * Отримати поточного користувача
 */
export async function getMe(): Promise<User | null> {
  try {
    const response = await serverApi.get<User>("/users/me", {
      headers: {
        Cookie: getCookieHeader(),
      },
    });

    return response.data;
  } catch {
    return null;
  }
}
