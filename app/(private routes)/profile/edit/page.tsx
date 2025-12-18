"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import css from "./EditProfilePage.module.css";

import { getMe, updateMe } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";
import type { User } from "@/types/user";

export default function EditProfilePage() {
  const router = useRouter();

  const setUser = useAuthStore((s) => s.setUser);

  const [user, setLocalUser] = useState<User | null>(null);

  const [username, setUsername] = useState("");

  useEffect(() => {
    async function fetchUser() {
      const currentUser = await getMe();
      setLocalUser(currentUser);
      setUsername(currentUser.username);
    }

    fetchUser();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!username.trim()) return;

    const updatedUser = await updateMe(username);

    // ✅ КЛЮЧЕВОЙ ПУНКТ ФИДБЕКА
    setUser(updatedUser);

    router.push("/profile");
  }

  if (!user) {
    return null;
  }

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>

        <Image
          src={user.avatar}
          alt="User Avatar"
          width={120}
          height={120}
          className={css.avatar}
        />

        <form className={css.profileInfo} onSubmit={handleSubmit}>
          <div className={css.usernameWrapper}>
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              type="text"
              className={css.input}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <p>Email: {user.email}</p>

          <div className={css.actions}>
            <button type="submit" className={css.saveButton}>
              Save
            </button>
            <button
              type="button"
              className={css.cancelButton}
              onClick={() => router.push("/profile")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
