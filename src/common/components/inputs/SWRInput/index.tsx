import { Loading } from "@/common/components/loading"
import { BsCheckLg } from "react-icons/bs"
import { useCallback, useEffect, useRef, useState } from "react"
//@ts-ignore
import debounce from 'lodash.debounce'
//@ts-ignore
import get from 'lodash.get'
//@ts-ignore
import set from 'lodash.set'
import { useSWRQuery } from "@/modules/supabase/useSWRQuery"
import produce from 'immer'
import supabase from '@/modules/supabase'
import toast from "react-hot-toast"

interface SWRInput {
    inputClassName?: string,
    query: any,
    field: string,
}

export function SWRInput({ inputClassName, query, field }: SWRInput) {

    const [saving, setSaving] = useState<'saving' | 'saved' | 'error' | null>(null)
    const swr = useSWRQuery(query)
    const input = useRef<any>()

    // get value from field
    const value = get(swr.data, field)
    // get the table of the document
    const table = query.url.pathname.substring(query.url.pathname.lastIndexOf('/') + 1)
    // get the column of the table
    const column = field.split('.')[0]

    // update input value when swr cache changes
    useEffect(() => {
        if (value) {
            input.current.value = value
        } else {
            input.current.value = ''
        }
    }, [value])

    function handleChange(content: string) {
        if (swr?.data?.id) {
            setSaving('saving')
            callback(swr.data, content, swr.data.id)
        }
    }
    const callback = useCallback(debounce(async (oldData: any, content: string, id: string) => {
        const newData = produce(oldData, (draft: any) => {
            // set the draft's field to the content of input
            set(draft, field, content)
        })
        //@ts-ignore mutate data
        swr.mutate(newData, false)
        try {
            const { error } = await supabase.from(table).update({ [column]: content }).eq('id', id)
            if (error) throw error
            setSaving('saved')
        } catch (error) {
            toast.error('Error: Could not save.')
            setSaving('error')
        }
    }, 500), [])

    return (
        <div className="relative inline-block">
            <input ref={input} className={'relative input text-base ' + inputClassName} onChange={(el) => handleChange(el.target.value)} />
            <div className="absolute scale-75 bottom-0 right-0">
                {saving === 'saving' && <Loading loaded={[false]} />}
                {saving === 'saved' && <BsCheckLg className='fill-primary' />}
                {saving === 'error' && <span className='text-error text-sm'>error</span>}
            </div>
        </div>
    )
}