import { PostgrestBuilder } from '@supabase/postgrest-js'
import toast from "react-hot-toast"
import useSWR, { Fetcher } from 'swr'

interface Query {
    data: {} | null,
    error: {} | null,
    isValidating: boolean,
    mutate: ()=>any
}

export function useSWRQuery<T>(query: PostgrestBuilder<T>) {

    const fetcher: Fetcher = async () =>{
        const { data, error } = await query  
        if(error){
            toast.error('Could not complete request.')
            throw error
        }
        return data
    }
    
    //@ts-ignore
    const { data, error, isValidating, mutate}: Query = useSWR(JSON.stringify(query.url), fetcher, { revalidateOnFocus: false })
    
    return {
        data: data ? data : null,
        loaded: !data && isValidating ? false : true,
        isValidating: isValidating,
        error: error ? error : null,
        mutate: mutate,
    }
}