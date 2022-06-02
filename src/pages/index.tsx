import { SWRInput } from "@/common/components/SWRInput"
import supabase from "@/modules/supabase"
import { SWREditorWrapper } from "@/modules/tiptap/wrappers/SWREditorWrapper"
import Link from "next/link"



export default function Index() {

  const query = supabase.from('documents').select('*').eq('id', '3ae344f4-c282-4b77-a055-ad7ba1c7b0f8').single()

  return (
    <div>
      <SWREditorWrapper query={query} content='overview' plaintext='overview_plaintext' />
      <SWRInput query={query} field='name' />
      <Link href='/test'>Go To Test</Link>
    </div>
  )
}
