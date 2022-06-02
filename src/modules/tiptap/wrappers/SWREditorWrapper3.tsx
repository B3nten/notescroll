import supabase from "../../supabase"
import { useSWRQuery } from "../../supabase/useSWRQuery"
import { Editor } from "../Editor"
import { useEffect, useState, useReducer } from "react"
import toast from "react-hot-toast"
import { dispatch } from "react-hot-toast/dist/core/store"

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

    const [editorContent, dispatch] = useReducer<any>(handleChange, null)

    async function handleChange(state: null, action: {json:{}, text:string}) {
        const newState = { ...queryData, [content]: action.json, [plaintext]: action.text }
        mutate(newState, false)
        try {
            const { error } = await supabase.from(table).update({ [content]: action.json, [plaintext]: action.text }).eq('id', queryData.id)
            if (error) throw error
            setSaveState('saved')
        } catch {
            toast.error('Error: Document not saved.')
            setSaveState('error')
        }
        return null
    }

    return (
        <Editor
            minHeight={'300px'}
            maxHeight={'400px'}
            editable={editable}
            contentLoaded={loaded}
            saveState={saveState}
            onUpdate={() => setSaveState('saving')}
            onDebouncedUpdate={(content) => dispatch({ ...content })}
            initialContent={queryData ? queryData[content] : null} />
    )
}
