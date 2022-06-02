import supabase from "../../supabase"
import { useSWRQuery } from "../../supabase/useSWRQuery"
import { Editor } from "../Editor"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

interface Wrapper {
    query: any,
    content: string,
    plaintext: string,
    editable?: boolean,
}

export function SWREditorWrapper({ query, content, plaintext, editable }: Wrapper) {

    const table = query.url.pathname.substring(query.url.pathname.lastIndexOf('/') + 1)
    const { data: queryData, mutate, loaded }: any = useSWRQuery(query)
    const [saveState, setSaveState] = useState<'saving' | 'saved' | 'error' | null>(null)
    const [editorContent, setEditorContent] = useState<any>()

    useEffect(() => {
        async function handleChange() {
            const newState = { ...queryData, [content]: editorContent.json, [plaintext]: editorContent.text }
            mutate(newState, false)
            try {
                const { error } = await supabase.from(table).update({ [content]: editorContent.json, [plaintext]: editorContent.text }).eq('id', queryData.id)
                if (error) throw error
                setSaveState('saved')
            } catch {
                toast.error('Error: Document not saved.')
                setSaveState('error')
            }
        }
        if (editorContent) {
            handleChange()
        }
    }, [editorContent])

    return (
        <Editor
            minHeight={'300px'}
            maxHeight={'400px'}
            editable={editable}
            contentLoaded={loaded}
            saveState={saveState}
            onUpdate={() => setSaveState('saving')}
            onDebouncedUpdate={(content) => setEditorContent(content)}
            initialContent={queryData ? queryData[content] : null} />
    )
}
