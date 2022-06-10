import { Dropdown, DropdownContent, DropdownItem, DropdownTrigger } from "@/common/components/dropdown"
import { useClientRouter } from "@/common/hooks/useClientRouter"
import { Dialog, DialogContent } from "@/common/components/dialog"
import { useState } from "react"
import { useKeydown } from "@/common/hooks/useKeydown"
import supabase from "@/modules/supabase"
import toast from "react-hot-toast"
import { GiGearHammer } from 'react-icons/gi'


export function Menu() {
    const router = useClientRouter()
    const [delNoteDialog, setDelNoteDialog] = useState(false)
    useKeydown('Escape', () => setDelNoteDialog(false))

    async function delNote() {

        try {
            const { error } = await supabase.from('documents').delete().eq('id', router.query.nid)
            if (error) throw error
            toast.success('Note deleted')
            router.push(`/campaign/${router.query.cid}/notes`)
        } catch (error) {
            toast.error('Cannot delete note')
        }
    }
    return (
        <>
            <Dropdown>
                <DropdownTrigger asChild>
                    <button className='btn btn-sm'><GiGearHammer className='fill-secondary stroke-secondary w-6 h-6' /></button>
                </DropdownTrigger>
                <DropdownContent>
                    <DropdownItem>
                        <button className='btn btn-ghost' onClick={() => setDelNoteDialog(true)}>Delete note</button>
                    </DropdownItem>
                </DropdownContent>
            </Dropdown>
            <Dialog open={delNoteDialog}>
                <DialogContent title='Delete Note' setOpen={setDelNoteDialog} >
                    Are you sure? The note cannot be recovered.
                    <div className='space-x-2 mt-5 flex justify-center'>
                        <button onClick={() => setDelNoteDialog(false)} className='btn btn-ghost w-20'>No</button>
                        <button onClick={delNote} className='btn btn-error w-20'>Yes</button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )

}