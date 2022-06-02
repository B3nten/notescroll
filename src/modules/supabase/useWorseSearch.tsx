import { useAsyncEffect } from "@/common/hooks/useAsyncEffect"
import supabase from "@/modules/supabase"
import { useState, useEffect, useCallback } from "react"
import { SupabaseQuery } from '@/types/supabase'
import produce from 'immer'

// Hook
function useDebounce(value: any, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value)
  useEffect(
    () => {
      const handler = setTimeout(() => {
        setDebouncedValue(value)
      }, delay)
      return () => {
        clearTimeout(handler)
      }
    },
    [value, delay]
  )
  return debouncedValue
}

export function useSearch(input:string) {

  const [searchResult, setSearchResult] = useState<SupabaseQuery>({
    loaded: false,
    error: null,
    data: null
  })

  const debounced = useDebounce(input, 600)

  useAsyncEffect(async function* () {
    if (input.length > 0) {
      try {
        const { data, error } = await supabase.rpc('search_documents', { document_term: debounced })
        if (error) throw error
        yield
        setSearchResult(produce((draft) => {
          draft.data = data
          draft.loaded = true
        }))
      } catch (error: any) {
        yield
        setSearchResult(produce((draft) => {
          draft.error = error
          draft.loaded = true
        }))
      }
    }
  }, [debounced])

  return searchResult
}