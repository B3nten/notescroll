import { useSearch } from '@/modules/supabase/useSearch'
import { DialogClose } from '@radix-ui/react-dialog'
import * as Label from '@radix-ui/react-label'
import { useState } from 'react'
import { Loading } from '@/common/components/loading'
import * as ToggleGroup from '@radix-ui/react-toggle-group'

type Reference = {
    name: string,
    id: string,
    type: string
}

export function ReferenceSearch({setReference}: any) {

    const [term, setTerm] = useState('')
    const search = useSearch(term)
    const [choice, setChoice] = useState<Reference>({
        name:'name',
        id: 'id',
        type: 'type'
    })

    return (
        <>
            <div className="relative">
                <Label.Root className='sr-only'>Search</Label.Root>
                <div className='relative inline-block'>
                    <input autoFocus className='input input-bordered input-primary'
                        placeholder='search'
                        onInput={(e: any) => setTerm(e.target.value)}>
                    </input>
                    <div className="absolute right-2 top-4">{search.isValidating && <Loading loaded={[false]} />}</div>
                </div>
                <ToggleGroup.Root type="single" className=' rounded-lg min-h-[10rem] max-h-[15rem] overflow-y-auto p-1' onValueChange={(v) => setChoice(v)}>
                    <div className="mt-2 flex flex-col items-start">
                        {search.loaded && search.data?.map((el: any) =>
                            <ToggleGroup.Item value={el} key={el.id} className='text-left focus:outline-double outline-1 rounded-sm p-1'>
                                <div className='text-lg'>{el.name}<span className='text-sm opacity-60'> {el.type}</span></div>
                            </ToggleGroup.Item>
                        )}
                        {search.data?.length === 0 && <div className='text-sm w-full opacity-80'>no results</div>}
                    </div>
                </ToggleGroup.Root>
            </div>
            <DialogClose asChild>
                <button disabled={!choice.id} onClick={() => setReference(choice.id, choice.type, choice.name)} className='btn btn-secondary'>Add Reference</button>
            </DialogClose>
        </>

    )
}