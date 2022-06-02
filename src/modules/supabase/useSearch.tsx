import supabase from "@/modules/supabase"
import { useState, useEffect, useCallback } from "react"
import { SupabaseQuery } from '@/types/supabase'
//@ts-ignore
import debounce from 'lodash.debounce'
import produce from 'immer'

export function useSearch(input: string) {

    const [searchResult, setSearchResult] = useState<SupabaseQuery>({
        loaded: false,
        error: null,
        data: null,
        isValidating: false,
    })

    const search = useCallback(debounce(async (input: string) => {
        setSearchResult(produce((draft)=>{draft.data = null}))
        if (input.length > 0) {
            setSearchResult(produce((draft)=>{draft.isValidating = true}))
            try {
                const { data, error } = await supabase.rpc('search_documents', { document_term: input })
                setSearchResult(produce((draft)=>{draft.isValidating = false}))
                if (error) throw error
                setSearchResult(produce((draft) => {
                    draft.data = data
                    draft.loaded = true
                }))
            } catch (error: any) {
                setSearchResult(produce((draft) => {
                    draft.error = error
                    draft.loaded = true
                }))
            }
        }
    }, 600), [input])

    useEffect(()=>{
        search(input)
        return ()=> search.cancel()
    },[input])


    return searchResult
}