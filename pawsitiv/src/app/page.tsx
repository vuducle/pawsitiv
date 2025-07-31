"use client";

import { useAuthStore } from "../stores/authStore";
import LandingPage from "./components/LandingPage";
import Dashboard from "./components/Dashboard";

export default function HomePage() {
  const { isAuthenticated, isLoading } = useAuthStore();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card p-8 rounded-3xl text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Render Dashboard for authenticated users, LandingPage for others
  return isAuthenticated ? <Dashboard /> : <LandingPage />;
}
