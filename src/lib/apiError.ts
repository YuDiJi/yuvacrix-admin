import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

type ApiErrorBody = { message?: string | string[]; error?: string };
export function getApiErrorMessage(error: unknown, fallback = "Something went wrong. Please try again.") {
  if (!error || typeof error !== "object") return fallback;
  const queryError = error as FetchBaseQueryError;
  if (queryError.status === "FETCH_ERROR") return "Unable to reach the server. Check your connection and try again.";
  if (queryError.status === 401) return "Your session has expired. Please sign in again.";
  if (queryError.status === 403) return "You do not have permission to perform this action.";
  if (queryError.status === 404) return "The requested resource could not be found.";
  if (queryError.status === 409) return "This action conflicts with the current data.";
  const data = queryError.data as ApiErrorBody | undefined;
  if (Array.isArray(data?.message)) return data.message.join(", ");
  if (typeof data?.message === "string") return data.message === "INVALID_ADMIN_CREDENTIALS" ? "Invalid email or password." : data.message;
  return fallback;
}
export function getErrorStatus(error: unknown) { return typeof error === "object" && error !== null && "status" in error ? (error as FetchBaseQueryError).status : undefined; }
