"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../stores/authStore";
import {
  FiUser,
  FiMail,
  FiCalendar,
  FiLogOut,
  FiAward,
  FiHeart,
} from "react-icons/fi";

/**
 * Profile page component with glassmorphism design and K-pop color theme
 *
 * Features:
 * - Glassmorphism UI with enhanced visual effects
 * - K-pop inspired color palette
 * - User profile information display
 * - Admin badge for admin users
 * - Logout functionality
 * - Responsive design
 *
 * @example
 * ```tsx
 * <ProfilePage />
 * ```
 */
export default function ProfilePage() {
  const router = useRouter();
  const { user, logout, isAuthenticated, checkAuth } = useAuthStore();

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated && user === null) {
      router.push("/login");
    }
  }, [isAuthenticated, user, router]);

  /**
   * Handles user logout
   */
  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  // Show loading state while checking auth
  if (!isAuthenticated && user === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-spinner h-8 w-8"></div>
      </div>
    );
  }

  // Don't render if no user
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-kpopPink/20 to-kpopPurple/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-br from-kpopBlue/20 to-kpopMint/20 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gradient-to-br from-kpopYellow/10 to-kpopPink/10 rounded-full blur-2xl animate-pulse delay-500"></div>
        <div className="absolute top-40 right-40 w-24 h-24 bg-gradient-to-br from-kpopMint/15 to-kpopBlue/15 rounded-full blur-lg animate-pulse delay-1500"></div>
      </div>

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Enhanced glassmorphism card */}
        <div className="glass-card p-8 shadow-glass">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-kpopPink to-kpopPurple rounded-full flex items-center justify-center shadow-lg">
                <FiHeart className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-extrabold kpop-gradient-text mb-2">
              Your Profile
            </h1>
            <p className="text-kpop-dark-secondary font-medium">
              Welcome back, {user.name}! 💖✨
            </p>
          </div>

          {/* Profile Information */}
          <div className="space-y-6">
            {/* Name */}
            <div className="glass p-4 rounded-xl border border-white/20">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-kpopPink/20 to-kpopPurple/20 rounded-full flex items-center justify-center">
                  <FiUser className="h-6 w-6 text-kpop-purple" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-kpop-dark-secondary mb-1">
                    Name
                  </p>
                  <p className="text-lg font-medium text-kpop-dark">
                    {user.name}
                  </p>
                </div>
              </div>
            </div>

            {/* Username */}
            <div className="glass p-4 rounded-xl border border-white/20">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-kpopPurple/20 to-kpopBlue/20 rounded-full flex items-center justify-center">
                  <FiUser className="h-6 w-6 text-kpop-purple" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-kpop-dark-secondary mb-1">
                    Username
                  </p>
                  <p className="text-lg font-medium text-kpop-dark">
                    @{user.username}
                  </p>
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="glass p-4 rounded-xl border border-white/20">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-kpopBlue/20 to-kpopMint/20 rounded-full flex items-center justify-center">
                  <FiMail className="h-6 w-6 text-kpopBlue" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-kpop-dark-secondary mb-1">
                    Email
                  </p>
                  <p className="text-lg font-medium text-kpop-dark">
                    {user.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Member Since */}
            <div className="glass p-4 rounded-xl border border-white/20">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-kpopMint/20 to-kpopYellow/20 rounded-full flex items-center justify-center">
                  <FiCalendar className="h-6 w-6 text-kpopMint" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-kpop-dark-secondary mb-1">
                    Member Since
                  </p>
                  <p className="text-lg font-medium text-kpop-dark">
                    {new Date(user.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Admin Badge */}
            {user.isAdmin && (
              <div className="glass p-4 rounded-xl border border-white/20 bg-gradient-to-r from-kpopPink/10 to-kpopPurple/10">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-kpopPink to-kpopPurple rounded-full flex items-center justify-center shadow-lg">
                    <FiAward className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-kpop-dark-secondary mb-1">
                      Role
                    </p>
                    <p className="text-lg font-medium text-kpop-dark">
                      👑 Admin User
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Logout Button */}
          <div className="mt-8">
            <button
              onClick={handleLogout}
              className="w-full flex justify-center items-center space-x-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-red-400 to-red-600 hover:from-red-500 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <FiLogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
