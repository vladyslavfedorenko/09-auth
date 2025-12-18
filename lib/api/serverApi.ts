import axios from "axios";
import type { AxiosResponse } from "axios";
import type { Note } from "@/types/note";
import type { User } from "@/types/user";
import { cookies } from "next/headers";

const api = axios.create({
  baseURL: "https://notehub-api.goit.study",
  withCredentials: true,
});

async function getCookieHeader(): Promise<string> {
  const cookieStore = await cookies();

  return cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");
}

/* ================= NOTES ================= */

export async function fetchNotes(params?: {
  search?: string;
  page?: number;
  tag?: string;
}): Promise<{ notes: Note[]; totalPages: number }> {
  const cookieHeader = await getCookieHeader();

  const response = await api.get<{ notes: Note[]; totalPages: number }>(
    "/notes",
    {
      params,
      headers: {
        Cookie: cookieHeader,
      },
    }
  );

  return response.data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const cookieHeader = await getCookieHeader();

  const response = await api.get<Note>(`/notes/${id}`, {
    headers: {
      Cookie: cookieHeader,
    },
  });

  return response.data;
}

/* ================= AUTH ================= */

export async function checkSession(): Promise<AxiosResponse<User | null>> {
  const cookieHeader = await getCookieHeader();

  return api.get<User | null>("/auth/session", {
    headers: {
      Cookie: cookieHeader,
    },
  });
}

/* ================= USER ================= */

export async function getMe(): Promise<User> {
  const cookieHeader = await getCookieHeader();

  const response = await api.get<User>("/users/me", {
    headers: {
      Cookie: cookieHeader,
    },
  });

  return response.data;
}
