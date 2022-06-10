import { useClientRouter } from "@/common/hooks/useClientRouter"
import { queries } from "@/modules/supabase/queries"
import { useSWRQuery } from "@/modules/supabase/useSWRQuery"
import { Layout } from "../../layout"
import { SWREditorWrapper } from "@/modules/tiptap/wrappers/SWREditorWrapper"
import { Menu } from "./Menu"
import { Dialog, DialogTrigger, DialogContent } from "@/common/components/dialog"
import { useRef } from "react"
import toast from "react-hot-toast"
import supabase from "@/modules/supabase"

export default function Timeline() {
    const router = useClientRouter()
    const timeline = useSWRQuery(queries.timeline.query(router.query.tid))
    const eventlist = useSWRQuery(queries.eventList.query(router.query.tid))
    console.log(eventlist)

    const startdate = timeline.data?.startdate ? new Date(timeline.data?.startdate).toISOString().split('T')[0] : null
    return (
        <>
            <div className="flex items-center justify-between">
                <h1 className='font-heading text-4xl'>{timeline.data?.name}, <span className='text-base'>{startdate}</span></h1>
                <Menu />
            </div>
            <h2 className='mt-10 text-3xl'>Overview</h2>
            <SWREditorWrapper query={queries.timeline.query(router.query.tid)} plaintext='overview_plaintext' content="overview" />
            <h2 className='mt-10 text-3xl'>Timeline</h2>
            <div className='card bg-base-200'>

                <div className='relative card-body p-4'>
                    <div className='absolute w-[1px] inset-0 mx-auto bg-primary'></div>
                    {eventlist.data?.length > 0 && eventlist.data.map((ev, i) => <Event key={ev.id} event={ev} index={i} />)}
                </div>
                <AddEvent />
            </div>
        </>

    )
}

function AddEvent() {

    const router = useClientRouter()
    const timeline = useSWRQuery(queries.timeline.query(router.query.tid))
    const eventlist = useSWRQuery(queries.eventList.query(router.query.tid))

    const startTime = timeline.data?.startdate ? timeline.data?.startdate : null
    let days = null
    let hours = null
    if (startTime) {
        const date = new Date(startTime)
        const isostr = date.toISOString()
        days = isostr.split('T')[0]
        hours = isostr.split('T')[1].substring(0, 5)
    }

    const name = useRef()
    const date = useRef()
    const time = useRef()

    async function addEvent() {

        const day = date.current.value
        const hour = time.current.value
        const combined = day + ',' + hour
        const formatted = combined.split('-').join(',').split(' ').join(',').split(':').join(',').split(',')
        const finalDate = Date.UTC(...formatted)

        if (name.current.value.length > 2) {
            try {
                const { error } = await supabase.from('events').insert({ name: name.current.value, campaign_id: router.query.cid, timeline_id: router.query.tid, date: finalDate })
                if (error) throw error
                toast.success('Event added')
                eventlist.mutate()
            } catch (error) {
                toast.error('Could not create event.', error)
                console.log(error, error.message)
            }
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild><button className='btn btn-circle text-2xl mx-auto mb-2'>+</button></DialogTrigger>
            <DialogContent title='Add event'>
                <div className='space-y-2'>
                    <label className='block'>
                        <div>Event Name</div>
                        <input ref={name} className='input input-primary w-full' />
                    </label>
                    <label className='block'>
                        <div>Event date and time</div>
                        <input ref={date} type="date" className='input input-primary' defaultValue={days} />
                        <input ref={time} type="time" className='input input-primary' defaultValue={hours} />
                    </label>
                    <button onClick={() => addEvent()} className='btn btn-primary'>Create</button>
                </div>
            </DialogContent>
        </Dialog >
    )
}

function isEven(n: number) {
    return n % 2 == 0
}

function Event({ event, index }: any) {
    const router = useClientRouter()
    const timeline = useSWRQuery(queries.timeline.query(router.query.tid))
    console.log(index)
    const date = event.date ? new Date(event.date) : null
    const unformattedTime = date ? date?.toISOString().split('T')[1] : null
    const time = unformattedTime ? unformattedTime.substring(0, 5) : null
    const days = date ? date.toISOString().split('T')[0] : null

    return (
        <div className='grid lg:grid-cols-2 gap-5 mb-5'>
            <div className={`${isEven(index) && 'hidden'}`}></div>
            <div className=' relative bg-base-300 p-2 rounded-md'>
                <h3 className='text-2xl'>{event.name}</h3>
                <div>{days}, <span>{time}</span></div>
                {event.id && <SWREditorWrapper maxHeight="300px" minHeight='150px' query={queries.event.query(event.id)} plaintext='overview_plaintext' content="overview" />}
            </div>
        </div>
    )
}

Timeline.getLayout = function getLayout(page: React.ReactNode) {
    return (
        <Layout>
            {page}
        </Layout>
    )
}