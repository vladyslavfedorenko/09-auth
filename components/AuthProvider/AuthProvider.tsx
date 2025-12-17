"use client";

import { useEffect, useState } from "react";
import { checkSession } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const setUser = useAuthStore((state) => state.setUser);
  const clearIsAuthenticated = useAuthStore(
    (state) => state.clearIsAuthenticated
  );

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function initAuth() {
      try {
        const user = await checkSession();

        if (user) {
          setUser(user);
        } else {
          clearIsAuthenticated();
        }
      } catch {
        clearIsAuthenticated();
      } finally {
        setLoading(false);
      }
    }

    initAuth();
  }, [setUser, clearIsAuthenticated]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
}
