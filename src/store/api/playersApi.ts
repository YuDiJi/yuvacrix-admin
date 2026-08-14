import { baseApi } from "./baseApi";
import type { AdminPlayerDetails, AdminPlayerModerationRequest, AdminPlayersQueryParams, AdminPlayersResponse } from "@/types/admin/player";
const cleanParams = (params: AdminPlayersQueryParams) => Object.fromEntries(Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== ""));
export const playersApi = baseApi.injectEndpoints({ endpoints: (build) => ({
  getAdminPlayers: build.query<AdminPlayersResponse, AdminPlayersQueryParams>({ query: (params) => ({ url: "/admin/players", params: cleanParams(params) }), providesTags: (result) => [{ type: "Player", id: "LIST" }, ...(result?.items.map((player) => ({ type: "Player" as const, id: player.id })) ?? [])] }),
  getAdminPlayer: build.query<AdminPlayerDetails, string>({ query: (id) => `/admin/players/${id}`, providesTags: (_result, _error, id) => [{ type: "Player", id }] }),
  updateAdminPlayerStatus: build.mutation<AdminPlayerDetails, { playerId: string; body: AdminPlayerModerationRequest }>({ query: ({ playerId, body }) => ({ url: `/admin/players/${playerId}/status`, method: "PATCH", body }), invalidatesTags: (_result, _error, { playerId }) => [{ type: "Player", id: playerId }, { type: "Player", id: "LIST" }] }),
}) });
export const { useGetAdminPlayersQuery, useGetAdminPlayerQuery, useUpdateAdminPlayerStatusMutation } = playersApi;
