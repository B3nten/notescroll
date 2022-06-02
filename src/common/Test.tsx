import supabase from "@/modules/supabase"
import { useSWRQuery } from "@/modules/supabase/useSWRQuery"

export function Test() {

    const query = supabase.from('documents').select('*').eq('id', '3ae344f4-c282-4b77-a055-ad7ba1c7b0f8').single()
    const response = useSWRQuery(query)

    return (
        <>
            {<div>{response.loaded && response.data?.overview_plaintext}</div>}
        </>

    )
}