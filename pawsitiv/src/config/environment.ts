export const config = {
  apiBaseUrl:
    process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:3669",
  isDevelopment: process.env.NODE_ENV === "development",
};
