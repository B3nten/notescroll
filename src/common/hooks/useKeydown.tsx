import { useEffect } from "react"
export function useKeydown(key: string, callback: () => void) {

    useEffect(() => {
        function handleKeyDown(e: any) {
            if (e.key === key) {
                callback()
            }
        }
        document.addEventListener('keydown', handleKeyDown)
        return () => document.removeEventListener("keydown", handleKeyDown)
    }, [])
}