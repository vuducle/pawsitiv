"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "../../stores/authStore";
import { FiMail, FiLock, FiEye, FiEyeOff, FiHeart } from "react-icons/fi";

/**
 * Login component with glassmorphism design and K-pop color theme
 *
 * Features:
 * - Glassmorphism UI with enhanced visual effects
 * - K-pop inspired color palette
 * - Form validation with real-time feedback
 * - Password visibility toggle
 * - Loading states with animated spinner
 * - Responsive design
 *
 * @example
 * ```tsx
 * <Login />
 * ```
 */
export default function Login() {
  const router = useRouter();
  const { login, isLoading, error, clearError, isAuthenticated } =
    useAuthStore();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  /**
   * Handles input changes and clears validation errors
   *
   * @param e - Input change event
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: "" }));
    }

    // Clear auth error when user starts typing
    if (error) {
      clearError();
    }
  };

  /**
   * Validates the login form
   *
   * @returns boolean - True if form is valid, false otherwise
   */
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /**
   * Handles form submission
   *
   * @param e - Form submit event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const success = await login({
      email: formData.email,
      password: formData.password,
    });

    if (success) {
      router.push("/");
    }
  };

  /**
   * Toggles password visibility
   */
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-kpopPink/20 to-kpopPurple/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-br from-kpopBlue/20 to-kpopMint/20 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gradient-to-br from-kpopYellow/10 to-kpopPink/10 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Enhanced glassmorphism card */}
        <div className="glass-card p-8 shadow-glass">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-kpopPink to-kpopPurple rounded-full flex items-center justify-center shadow-lg">
                <FiHeart className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-extrabold kpop-gradient-text mb-2">
              Welcome Back!
            </h2>
            <p className="text-kpop-dark-secondary font-medium">
              Sign in to continue your cat adventure! 🐱✨
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-kpop-dark mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-kpop-purple z-10" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl focus:outline-none transition-all duration-300 glass-input ${
                    validationErrors.email
                      ? "border-red-400 focus:border-red-400"
                      : "focus:border-kpopPurple"
                  }`}
                  placeholder="Enter your email"
                />
              </div>
              {validationErrors.email && (
                <p className="mt-2 text-sm font-medium text-red-600 flex items-center">
                  <span className="w-1 h-1 bg-red-600 rounded-full mr-2"></span>
                  {validationErrors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-kpop-dark mb-2"
              >
                Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-kpop-purple z-10" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-12 py-3 rounded-xl focus:outline-none transition-all duration-300 glass-input ${
                    validationErrors.password
                      ? "border-red-400 focus:border-red-400"
                      : "focus:border-kpopPurple"
                  }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-kpop-purple hover:text-kpop-pink transition-colors duration-200 z-10"
                >
                  {showPassword ? (
                    <FiEyeOff className="h-5 w-5" />
                  ) : (
                    <FiEye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {validationErrors.password && (
                <p className="mt-2 text-sm font-medium text-red-600 flex items-center">
                  <span className="w-1 h-1 bg-red-600 rounded-full mr-2"></span>
                  {validationErrors.password}
                </p>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 shadow-sm">
                <p className="text-sm font-medium text-red-700 flex items-center">
                  <span className="w-2 h-2 bg-red-600 rounded-full mr-2"></span>
                  {error}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 rounded-xl text-sm font-semibold text-white glass-button disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="glass-spinner h-4 w-4 mr-2"></div>
                  Signing In...
                </div>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Links */}
          <div className="mt-8 space-y-4 text-center">
            <p className="text-sm text-kpop-dark-secondary">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="font-semibold text-kpop-pink hover:text-kpop-purple transition-colors duration-200"
              >
                Sign up here
              </Link>
            </p>

            <p className="text-sm text-kpop-dark-secondary">
              <Link
                href="/forgot-password"
                className="font-semibold text-kpop-pink hover:text-kpop-purple transition-colors duration-200"
              >
                Forgot your password?
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
