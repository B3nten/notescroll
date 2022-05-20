import { useEffect } from "react"

export function useEffectAfterPaint(effect: () => void, dependencies: Array<any>) {
    useEffect(() => {
        requestAnimationFrame(() => {
            setTimeout(() => {
                effect()
            }, 0)
        })
    }, dependencies)
}