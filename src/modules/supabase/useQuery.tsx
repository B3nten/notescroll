import { useAsyncMount } from "@/common/hooks/useAsyncMount"
import { SupabaseQuery } from "@/types/supabase"
import { PostgrestBuilder } from '@supabase/postgrest-js'
import { useState } from "react"
import produce from "immer"
import toast from "react-hot-toast"

export function useQuery<T>(query: PostgrestBuilder<T>) {

    const [document, setDocument] = useState<SupabaseQuery>({
        loaded: false,
        error: null,
        data: null
    })

    useAsyncMount(async function* () {
        try {
            const { data, error } = await query
            if (error) throw error
            yield
            setDocument(
                produce((draft) => {
                    draft.loaded = true
                    draft.data = data
                }))
        } catch (error: any) {
            yield;
            toast.error(error.message || 'Could not load document')
            setDocument(
                produce((draft) => {
                    draft.error = error
                    draft.loaded = true
                })
            )
        }
    })
    return document
}