import {
	PostgrestBuilder,
	PostgrestSingleResponse,
} from '@supabase/postgrest-js'
import { QueryKey, QueryOptions, useQuery } from 'react-query'

export function useSupabaseQuery<T>(
	key: QueryKey,
	fetcher: PostgrestBuilder<T> | PromiseLike<PostgrestSingleResponse<any>>,
	options?: QueryOptions
) {
	const query = useQuery(
		key,
		async () => {
			const { data, error } = await fetcher
			if (error) throw error
			return data
		},
		options
	)
	return { ...query }
}
