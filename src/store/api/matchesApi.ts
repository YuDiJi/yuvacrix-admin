import { baseApi } from "./baseApi";
import type { AdminMatchDetails, AdminMatchesQueryParams, AdminMatchesResponse } from "@/types/admin/match";

function cleanParams(params: AdminMatchesQueryParams) {
  return Object.fromEntries(Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== ""));
}

export const matchesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAdminMatches: build.query<AdminMatchesResponse, AdminMatchesQueryParams>({
      query: (params) => ({ url: "/admin/matches", params: cleanParams(params) }),
      providesTags: (result) => [{ type: "Match", id: "LIST" }, ...(result?.items.map((match) => ({ type: "Match" as const, id: match.id })) ?? [])],
    }),
    getAdminMatch: build.query<AdminMatchDetails, string>({
      query: (matchId) => `/admin/matches/${matchId}`,
      providesTags: (_result, _error, matchId) => [{ type: "Match", id: matchId }],
    }),
  }),
});

export const { useGetAdminMatchesQuery, useGetAdminMatchQuery } = matchesApi;
