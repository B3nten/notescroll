import { QueryKey, useQuery, useQueryClient } from 'react-query'
import type { PostgrestSingleResponse } from '@supabase/postgrest-js'
import type { UseQueryOptions } from 'react-query'

export function useSupabaseQuery<T = any>(
	key: QueryKey,
	query: PromiseLike<PostgrestSingleResponse<T>> & { _table?: string },
	options?: UseQueryOptions<T> & { queryKey?: string | unknown[] }
) {
	const queryClient = useQueryClient()
	const invalidate = () => queryClient.invalidateQueries(key)
	const setQueryData = (data: any) => queryClient.setQueryData(key, data)
	async function fetcher() {
		const { data, error } = await query
		if (error) throw error
		return data
	}

	const result = useQuery<T>(key, async () => fetcher(), options)
	return { ...result, client: queryClient, invalidate, setQueryData }
}
