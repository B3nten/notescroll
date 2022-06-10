import { pluralizeType } from "@/common/functions/pluralizeType"
import { useClientRouter } from "@/common/hooks/useClientRouter"
import { queries } from "@/modules/supabase/queries"
import { useSWRQuery } from "@/modules/supabase/useSWRQuery"
import Link from "next/link"
import { Layout } from "../layout"
import { AddNote } from "./AddNote"

export default function Notes() {
    const router = useClientRouter()
    const type = router.query.type
    const noteList = useSWRQuery(queries.noteList.query(router.query.cid))

    return (
        <div className="card bg-base-200">
            <div className="card-body">
                <div className="flex justify-between">
                    <h2 className='card-title font-heading'>Notes - <span className="capitalize">{pluralizeType(type) ?? 'All'}</span></h2>
                    <AddNote />
                </div>
                <ul className='space-y-1'>
                    {noteList.data?.filter((el: any) => type ? (el.type === type) : true).map((note: any) =>
                        <li key={note.id} className='flex justify-between items-center p-2 bg-base-300 rounded-md text-lg'>
                            <span>{note.name}, <span className="text-sm">{note.type}</span></span>
                            <Link href={`/campaign/${router.query.cid}/notes/${note.id}`}>
                                <button className='btn btn-sm'>open</button>
                            </Link>
                        </li>
                    )}
                </ul>
            </div>
        </div>
    )
}

Notes.getLayout = function getLayout(page: React.ReactNode) {
    return (
        <Layout>
            {page}
        </Layout>
    )
}


// js sort algorythim
// set query parameters: type, categories, order (ascending/descending), sort field (name, date, etc)