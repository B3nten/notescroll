import Link from "next/link"
import { useState } from "react"

export default function Dashboard(props:any) {
    const [count, setCount] = useState(0)
    return (
        <div>
            <button className='btn' onClick={() => setCount(s => s + 1)}>Increase {count}</button>
            <Link href='/dashboard/settings'>Settings</Link>
            {props.children ?? <div>parent</div>}
        </div>
    )
}

// user dashboard
    // settings
    // global docs
    // characters
// campaign dashboard
    // documents
    // timelines