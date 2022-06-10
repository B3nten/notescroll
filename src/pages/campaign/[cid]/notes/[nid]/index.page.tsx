import { Dropdown, DropdownContent, DropdownItem, DropdownTrigger } from "@/common/components/dropdown"
import { useClientRouter } from "@/common/hooks/useClientRouter"
import { queries } from "@/modules/supabase/queries"
import { useSWRQuery } from "@/modules/supabase/useSWRQuery"
import { SWREditorWrapper } from "@/modules/tiptap/wrappers/SWREditorWrapper"
import { Layout } from "../../layout"
import { Menu } from "./Menu"

export default function Note() {
    const router = useClientRouter()
    const note = useSWRQuery(queries.note.query(router.query.nid))

    return (
        <>
            <div className="flex items-center justify-between">
                <h1 className='font-heading text-4xl'>{note.data?.name}</h1>
                <Menu />
            </div>
            <SWREditorWrapper query={queries.note.query(router.query.nid)} plaintext='overview_plaintext' content="overview" />
        </>
    )
}

Note.getLayout = function getLayout(page: React.ReactNode) {
    return (
        <Layout>
            {page}
        </Layout>
    )
}