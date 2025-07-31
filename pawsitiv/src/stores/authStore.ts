import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * User interface representing the authenticated user data
 */
export interface User {
  /** Unique identifier for the user */
  id: string;
  /** User's full name */
  name: string;
  /** Unique username for the user */
  username: string;
  /** User's email address */
  email: string;
  /** Whether the user has admin privileges */
  isAdmin: boolean;
  /** Timestamp when the user account was created */
  createdAt: string;
}

/**
 * Login credentials interface
 */
export interface LoginCredentials {
  /** User's email address */
  email: string;
  /** User's password */
  password: string;
}

/**
 * Registration data interface
 */
export interface RegisterData {
  /** User's full name */
  name: string;
  /** Unique username for the user */
  username: string;
  /** User's email address */
  email: string;
  /** User's password */
  password: string;
}

/**
 * Authentication store state interface
 */
interface AuthState {
  /** Current authenticated user or null if not authenticated */
  user: User | null;
  /** Whether an authentication operation is in progress */
  isLoading: boolean;
  /** Error message from authentication operations */
  error: string | null;
  /** Whether the user is authenticated */
  isAuthenticated: boolean;
}

/**
 * Authentication store actions interface
 */
interface AuthActions {
  /** Set the current user and authentication state */
  setUser: (user: User | null) => void;
  /** Set loading state */
  setLoading: (loading: boolean) => void;
  /** Set error message */
  setError: (error: string | null) => void;
  /** Clear error message */
  clearError: () => void;
  /** Login user with credentials */
  login: (credentials: LoginCredentials) => Promise<boolean>;
  /** Register new user */
  register: (data: RegisterData) => Promise<boolean>;
  /** Logout current user */
  logout: () => Promise<void>;
  /** Check if user is authenticated on app start */
  checkAuth: () => Promise<void>;
}

/**
 * Authentication store type combining state and actions
 */
type AuthStore = AuthState & AuthActions;

/**
 * Zustand store for authentication state management
 *
 * This store manages user authentication state including:
 * - User data persistence
 * - Login/logout functionality
 * - Registration
 * - Loading and error states
 *
 * @example
 * ```typescript
 * const { user, login, logout, isLoading } = useAuthStore();
 *
 * // Login
 * const success = await login({ email: 'user@example.com', password: 'password' });
 *
 * // Logout
 * await logout();
 * ```
 */
export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isLoading: false,
      error: null,
      isAuthenticated: false,

      // Actions
      setUser: (user: User | null) => {
        set({
          user,
          isAuthenticated: !!user,
          error: null,
        });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      clearError: () => {
        set({ error: null });
      },

      /**
       * Authenticate user with email and password
       *
       * @param credentials - Login credentials containing email and password
       * @returns Promise<boolean> - True if login successful, false otherwise
       */
      login: async (credentials: LoginCredentials): Promise<boolean> => {
        const { setLoading, setError, setUser } = get();

        try {
          setLoading(true);
          setError(null);

          const response = await fetch(
            "http://localhost:3669/api/users/login",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
              body: JSON.stringify(credentials),
            }
          );

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || "Login failed");
          }

          setUser(data.user);
          return true;
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Login failed";
          setError(errorMessage);
          return false;
        } finally {
          setLoading(false);
        }
      },

      /**
       * Register a new user account
       *
       * @param data - Registration data containing name, username, email, and password
       * @returns Promise<boolean> - True if registration successful, false otherwise
       */
      register: async (data: RegisterData): Promise<boolean> => {
        const { setLoading, setError, setUser } = get();

        try {
          setLoading(true);
          setError(null);

          const response = await fetch(
            "http://localhost:3669/api/users/register",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
              body: JSON.stringify(data),
            }
          );

          const responseData = await response.json();

          if (!response.ok) {
            throw new Error(responseData.message || "Registration failed");
          }

          setUser(responseData.user);
          return true;
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Registration failed";
          setError(errorMessage);
          return false;
        } finally {
          setLoading(false);
        }
      },

      /**
       * Logout current user and clear authentication state
       */
      logout: async (): Promise<void> => {
        const { setLoading, setError, setUser } = get();

        try {
          setLoading(true);
          setError(null);

          await fetch("http://localhost:3669/api/users/logout", {
            method: "POST",
            credentials: "include",
          });

          setUser(null);
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Logout failed";
          setError(errorMessage);
        } finally {
          setLoading(false);
        }
      },

      /**
       * Check if user is authenticated on app start
       * This should be called when the app initializes
       */
      checkAuth: async (): Promise<void> => {
        const { setLoading, setError, setUser } = get();

        try {
          setLoading(true);
          setError(null);

          const response = await fetch("http://localhost:3669/api/users/me", {
            credentials: "include",
          });

          const data = await response.json();

          if (response.ok && data.user) {
            setUser(data.user);
          } else {
            setUser(null);
          }
        } catch (error) {
          setUser(null);
          // Don't set error for auth check failures
        } finally {
          setLoading(false);
        }
      },
    }),
    {
      name: "auth-storage", // Local storage key
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }), // Only persist user and auth state
    }
  )
);
