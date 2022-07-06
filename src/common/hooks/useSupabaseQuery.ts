import { QueryKey, useQuery } from 'react-query'
import type { PostgrestSingleResponse } from '@supabase/postgrest-js'
import type { UseQueryOptions } from 'react-query'

export function useSupabaseQuery<T = any>(
	key: QueryKey,
	query: PromiseLike<PostgrestSingleResponse<T>> & { _table?: string },
	options?: UseQueryOptions<T> & { queryKey?: string | unknown[] }
) {
	async function fetcher() {
		const { data, error } = await query
		if (error) throw error
		return data
	}

	return useQuery<T>(key, async () => fetcher(), options)
}
