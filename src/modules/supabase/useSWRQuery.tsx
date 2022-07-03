import {
	PostgrestBuilder,
	PostgrestSingleResponse,
} from '@supabase/postgrest-js'
import toast from 'react-hot-toast'
import useSWR, { Fetcher } from 'swr'

interface Query {
	data?: any
	error?: {} | null | unknown
	isValidating: boolean
	mutate: () => any
}

export function useSWRQuery<T>(
	query: PostgrestBuilder<T> | PromiseLike<PostgrestSingleResponse<any>>,
	{
		revalidateOnMount = true,
		revalidateOnFocus = false,
		fallbackData = null,
	} = {}
) {
	const fetcher: Fetcher = async () => {
		console.log('making request')
		const { data, error } = await query
		if (error) {
			toast.error('Could not complete request.')
			throw error
		}
		return data
	}

	const { data, error, isValidating, mutate }: Query = useSWR(
		//@ts-ignore
		JSON.stringify(query.url),
		fetcher,
		{
			revalidateOnFocus: revalidateOnFocus,
			revalidateOnMount: revalidateOnMount,
			fallbackData: fallbackData,
		}
	)

	return {
		data: data ? data : null,
		loaded: !data && isValidating ? false : true,
		isValidating: isValidating,
		error: error ? error : null,
		mutate: mutate,
	}
}
