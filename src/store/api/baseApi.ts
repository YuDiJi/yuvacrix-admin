import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";

const rawBaseQuery = fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL, credentials: "include" });
let refreshInFlight: Promise<boolean> | null = null;

function requestUrl(args: string | FetchArgs) { return typeof args === "string" ? args : args.url; }
const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);
  const url = requestUrl(args);
  const canRefresh = result.error?.status === 401 && !url.includes("/admin/auth/login") && !url.includes("/admin/auth/refresh");
  if (!canRefresh) return result;
  if (!refreshInFlight) {
    refreshInFlight = Promise.resolve(rawBaseQuery({ url: "/admin/auth/refresh", method: "POST" }, api, extraOptions))
      .then((refreshResult) => !refreshResult.error)
      .finally(() => { refreshInFlight = null; });
  }
  if (await refreshInFlight) {
    result = await rawBaseQuery(args, api, extraOptions);
  } else if (!url.includes("/admin/auth/me")) {
    // Recheck the authoritative session after refresh failure, even when a
    // successful /auth/me response was already cached.
    api.dispatch(baseApi.util.invalidateTags(["AdminAuth"]));
  }
  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["AdminAuth", "Dashboard", "User", "Player", "Team", "Match", "Tournament", "Report", "AuditLog"],
  endpoints: () => ({}),
});
