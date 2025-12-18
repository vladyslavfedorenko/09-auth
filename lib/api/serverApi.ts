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

export async function fetchNotes(params?: {
  search?: string;
  page?: number;
  tag?: string;
}): Promise<AxiosResponse<{ notes: Note[]; totalPages: number }>> {
  const cookieHeader = await getCookieHeader();

  return api.get("/notes", {
    params,
    headers: {
      Cookie: cookieHeader,
    },
  });
}

export async function fetchNoteById(id: string): Promise<AxiosResponse<Note>> {
  const cookieHeader = await getCookieHeader();

  return api.get(`/notes/${id}`, {
    headers: {
      Cookie: cookieHeader,
    },
  });
}

export async function checkSession(): Promise<AxiosResponse<User | null>> {
  const cookieHeader = await getCookieHeader();

  return api.get<User | null>("/auth/session", {
    headers: {
      Cookie: cookieHeader,
    },
  });
}

export async function getMe(): Promise<AxiosResponse<User>> {
  const cookieHeader = await getCookieHeader();

  return api.get<User>("/users/me", {
    headers: {
      Cookie: cookieHeader,
    },
  });
}
