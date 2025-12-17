import { api } from "./api";
import type { Note } from "@/types/note";
import type { User } from "@/types/user";

/* ===================== NOTES ===================== */

interface FetchNotesParams {
  search?: string;
  page?: number;
  tag?: string;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export async function fetchNotes(params: FetchNotesParams) {
  const response = await api.get<FetchNotesResponse>("/notes", {
    params,
  });
  return response.data;
}

export async function fetchNoteById(id: string) {
  const response = await api.get<Note>(`/notes/${id}`);
  return response.data;
}

export async function createNote(data: {
  title: string;
  content: string;
  tag?: string;
}) {
  const response = await api.post<Note>("/notes", data);
  return response.data;
}

export async function deleteNote(id: string) {
  const response = await api.delete<Note>(`/notes/${id}`);
  return response.data;
}

/* ===================== AUTH ===================== */

interface AuthResponse {
  user: User;
}

export async function register(email: string, password: string) {
  const response = await api.post<AuthResponse>("/auth/register", {
    email,
    password,
  });
  return response.data.user;
}

export async function login(email: string, password: string) {
  const response = await api.post<AuthResponse>("/auth/login", {
    email,
    password,
  });
  return response.data.user;
}

export async function logout() {
  await api.post("/auth/logout");
}

export async function checkSession() {
  const response = await api.get<User | null>("/auth/session");
  return response.data;
}

/* ===================== USER ===================== */

export async function getMe() {
  const response = await api.get<User>("/users/me");
  return response.data;
}

export async function updateMe(username: string) {
  const response = await api.patch<User>("/users/me", {
    username,
  });
  return response.data;
}
