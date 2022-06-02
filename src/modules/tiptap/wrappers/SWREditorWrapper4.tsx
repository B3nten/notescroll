import supabase from "../../supabase"
import { useSWRQuery } from "../../supabase/useSWRQuery"
import { Editor } from "../Editor"
import { useEffect, useState, useRef } from "react"
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
    const queryDataRef = useRef({})

    useEffect(() => {
        queryDataRef.current = queryData
    }, [queryData])

    async function handleChange(editorContent:any) {
        const newState = { ...queryDataRef.current, [content]: editorContent.json, [plaintext]: editorContent.text }
        mutate(newState, false)
        try {
            console.log(content, plaintext)
            const { error } = await supabase.from(table).update({ [content]: editorContent.json, [plaintext]: editorContent.text }).eq('id', queryDataRef.current.id)
            if (error) throw error
            setSaveState('saved')
        } catch(error) {
            console.log(error)
            toast.error('Error: Document not saved.')
            setSaveState('error')
        }
    }

    return (
        <Editor
            minHeight={'300px'}
            maxHeight={'400px'}
            editable={editable}
            contentLoaded={loaded}
            saveState={saveState}
            onUpdate={() => setSaveState('saving')}
            onDebouncedUpdate={(content) => handleChange(content)}
            initialContent={queryData ? queryData[content] : null} />
    )
}
