"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { checkSession } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const pathname = usePathname();

  const setUser = useAuthStore((s) => s.setUser);
  const clearIsAuthenticated = useAuthStore((s) => s.clearIsAuthenticated);

  const [isChecking, setIsChecking] = useState(true);

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
        // 📌 КЛЮЧЕВОЙ ПУНКТ ФИДБЕКА
        router.refresh();
        setIsChecking(false);
      }
    }

    initAuth();
  }, [pathname, router, setUser, clearIsAuthenticated]);

  // ⏳ Лоадер на время проверки сессии
  if (isChecking) {
    return null;
  }

  return <>{children}</>;
}
