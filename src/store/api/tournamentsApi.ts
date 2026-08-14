import { baseApi } from "./baseApi";
import type { AdminTournamentDetails, AdminTournamentModerationRequest, AdminTournamentsQueryParams, AdminTournamentsResponse } from "@/types/admin/tournament";

function cleanParams(params: AdminTournamentsQueryParams) {
  return Object.fromEntries(Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== ""));
}

export const tournamentsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAdminTournaments: build.query<AdminTournamentsResponse, AdminTournamentsQueryParams>({
      query: (params) => ({ url: "/admin/tournaments", params: cleanParams(params) }),
      providesTags: (result) => [{ type: "Tournament", id: "LIST" }, ...(result?.items.map((tournament) => ({ type: "Tournament" as const, id: tournament.id })) ?? [])],
    }),
    getAdminTournament: build.query<AdminTournamentDetails, string>({
      query: (tournamentId) => `/admin/tournaments/${tournamentId}`,
      providesTags: (_result, _error, tournamentId) => [{ type: "Tournament", id: tournamentId }],
    }),
    updateAdminTournamentStatus: build.mutation<AdminTournamentDetails, { tournamentId: string; body: AdminTournamentModerationRequest }>({
      query: ({ tournamentId, body }) => ({ url: `/admin/tournaments/${tournamentId}/status`, method: "PATCH", body }),
      invalidatesTags: (_result, _error, { tournamentId }) => [{ type: "Tournament", id: tournamentId }, { type: "Tournament", id: "LIST" }],
    }),
  }),
});

export const { useGetAdminTournamentsQuery, useGetAdminTournamentQuery, useUpdateAdminTournamentStatusMutation } = tournamentsApi;
