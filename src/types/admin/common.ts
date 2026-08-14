export type PaginatedResponse<T> = { items: T[]; pagination: { skip: number; limit: number; total: number; hasMore: boolean } };
