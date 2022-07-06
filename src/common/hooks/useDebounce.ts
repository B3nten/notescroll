import debounce from 'lodash.debounce'
import { useCallback } from 'react'
import { useEvent } from './useEvent'

export function useDebounce(handler: () => any, delay = 1000) {
	const event = useEvent(handler)
	return useCallback(
		debounce(() => {
			event()
		}, delay),
		[]
	)
}
