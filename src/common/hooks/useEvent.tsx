import { useLayoutEffect, useRef, useCallback } from 'react'

export function useEvent(handler: (...args: any) => any) {
	const handlerRef = useRef<any>(null)

	useLayoutEffect(() => {
		handlerRef.current = handler
	})

	return useCallback((...args: any) => {
		const fn = handlerRef.current
		return fn(...args)
	}, [])
}
