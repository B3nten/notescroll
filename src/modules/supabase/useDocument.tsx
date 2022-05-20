// state: {loaded: false, error: null, data: }
// take in query, campaign
// supabase query 
// mutate stat
import { useMount } from "@/common/hooks/useMount"
import supabase from "@/modules/supabase"
import { SupabaseQuery } from "@/types/supabase"
import { useState } from "react"

export function useDocument(campaign: string, documentType: string) {

    const [document, setDocument] = useState<SupabaseQuery>({
        loaded: true,
        error: null,
        data: null
    })

    async function queryDocument(){
        const {data, error} = await supabase.from<any>('documents').select('*').eq('type', documentType).eq('campaign_id', campaign)
    }

    useMount(() => {
        
    })

    return document
}