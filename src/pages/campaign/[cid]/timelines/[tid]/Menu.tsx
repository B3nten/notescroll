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
    const [delTimelineDialog, setDelTimelineDialog] = useState(false)
    useKeydown('Escape', () => setDelTimelineDialog(false))

    async function delTimeline() {

        try {
            const { error } = await supabase.from('timelines').delete().eq('id', router.query.tid)
            if (error) throw error
            toast.success('Timeline deleted')
            router.push(`/campaign/${router.query.cid}/timelines`)
        } catch (error) {
            toast.error('Cannot delete timeline')
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
                        <button className='btn btn-ghost' onClick={() => setDelTimelineDialog(true)}>Delete timeline</button>
                    </DropdownItem>
                </DropdownContent>
            </Dropdown>
            <Dialog open={delTimelineDialog}>
                <DialogContent title='Delete timeline' setOpen={setDelTimelineDialog} >
                    Are you sure? The timeline and associated events be recovered.
                    <div className='space-x-2 mt-5 flex justify-center'>
                        <button onClick={() => setDelTimelineDialog(false)} className='btn btn-ghost w-20'>No</button>
                        <button onClick={delTimeline} className='btn btn-error w-20'>Yes</button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )

}