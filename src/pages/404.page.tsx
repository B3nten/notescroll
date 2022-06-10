import { useClientRouter } from "@/common/hooks/useClientRouter"

export default function FourOhFour() {
    const router = useClientRouter()
    return <button onClick={() => router.push('/')} className='btn btn-lg'>Go home</button>
}