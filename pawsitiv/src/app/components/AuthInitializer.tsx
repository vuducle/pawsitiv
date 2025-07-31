"use client";

import { useEffect } from "react";
import { useAuthStore } from "../../stores/authStore";

/**
 * AuthInitializer component
 *
 * This component initializes the authentication state when the app starts.
 * It runs on the client side and checks if the user is already authenticated
 * by calling the checkAuth method from the Zustand store.
 *
 * This component doesn't render anything visible - it's purely for initialization.
 *
 * @example
 * ```tsx
 * <AuthInitializer />
 * ```
 */
export default function AuthInitializer() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    // Check authentication status when the app starts
    checkAuth();
  }, [checkAuth]);

  // This component doesn't render anything
  return null;
}
