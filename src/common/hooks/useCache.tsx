import { QueryKey, useQuery } from 'react-query'

export function useCache(key: QueryKey) {
	const { data, isIdle, isSuccess } = useQuery(
		key,
		() => {
			return
		},
		{ enabled: false }
	)
	return { data, isIdle, isSuccess }
}
