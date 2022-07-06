import { useEffect, useState } from 'react'
import { QueryKey, useQueryClient, QueryObserver, QueryObserverResult } from 'react-query'

export function useObserver<T>(key: QueryKey) {
	const client = useQueryClient()
	const [state, setState] = useState<QueryObserverResult<T, unknown>>()
	useEffect(() => {
		const observer = new QueryObserver<T>(client, { queryKey: key, enabled: false })
		const unsubscribe = observer.subscribe(result => {
			setState(result)
		})
		return () => unsubscribe()
	}, [])
	if (state) return state
	return {
		data: undefined,
		error: null,
		isError: false,
		isLoading: true,
		isLoadingError: false,
		isRefetchError: false,
		isSuccess: false,
		status: 'loading',
	}
}
