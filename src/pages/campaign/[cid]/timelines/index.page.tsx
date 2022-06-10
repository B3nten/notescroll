import { pluralizeType } from "@/common/functions/pluralizeType"
import { useClientRouter } from "@/common/hooks/useClientRouter"
import { queries } from "@/modules/supabase/queries"
import { useSWRQuery } from "@/modules/supabase/useSWRQuery"
import Link from "next/link"
import { Layout } from "../layout"
import { AddTimeline } from "./AddTimeline"

export default function Timelines() {
    const router = useClientRouter()
    const timelineList = useSWRQuery(queries.timelineList.query(router.query.cid))
    console.log(timelineList)


    return (
        <div className="card bg-base-200">
            <div className="card-body">
                <div className="flex justify-between">
                    <h2 className='card-title font-heading'>Timelines</h2>
                    <AddTimeline />
                </div>
                {timelineList.data?.length < 1 && <div>No timelines</div>}
                <ul className='space-y-1'>
                    {timelineList.data?.map((tl: any) =>
                        <li key={tl.id} className='flex justify-between items-center p-2 bg-base-300 rounded-md text-lg'>
                            <span>{tl.name}</span>
                            <Link href={`/campaign/${router.query.cid}/timelines/${tl.id}`}>
                                <button className='btn btn-sm'>open</button>
                            </Link>
                        </li>
                    )}
                </ul>
            </div>
        </div >
    )
}

Timelines.getLayout = function getLayout(page: React.ReactNode) {
    return (
        <Layout>
            {page}
        </Layout>
    )
}