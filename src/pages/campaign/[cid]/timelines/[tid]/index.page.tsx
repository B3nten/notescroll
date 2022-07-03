import { useClientRouter } from '@/common/hooks/useClientRouter'
import { queries } from '@/modules/supabase/queries'
import { useSWRQuery } from '@/modules/supabase/useSWRQuery'
import { Layout } from '../../layout'
import { SWREditorWrapper } from '@/modules/tiptap/wrappers/SWREditorWrapper'
import { Menu } from './Menu'
import {
	Dialog,
	DialogTrigger,
	DialogContent,
} from '@/common/components/dialog'
import { useRef } from 'react'
import toast from 'react-hot-toast'
import supabase from '@/modules/supabase'
import { EditableDiv } from '@/common/components/inputs/EditableDiv'
import { EditableDate } from '@/common/components/inputs/EditableDate'
import * as dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { LoadingSpinner } from '@/common/components/loading'
import { useAutoAnimate } from '@formkit/auto-animate/react'
dayjs.extend(utc)

export default function Timeline() {
	const [animationParent] = useAutoAnimate()
	const router = useClientRouter()
	const tlQuery = supabase
		.from('timelines')
		.select('*')
		.eq('id', router.query.tid)
		.single()
	const timeline = useSWRQuery(tlQuery)
	const eventlist = useSWRQuery(
		supabase
			.from('events')
			.select('id, date')
			.eq('timeline_id', router.query.tid)
	)

	if (!timeline.loaded) return <LoadingSpinner />

	const startdate = dayjs
		.utc(timeline.data.startdate)
		.format('YYYY MMM DD, hh:mma')
	return (
		<>
			<div className='flex items-center justify-between'>
				<div>
					<h1 className='font-heading text-4xl'>
						<EditableDiv query={tlQuery} field='name' />
					</h1>
					<div className='px-2'>Starting date: {startdate}</div>
				</div>
				<Menu />
			</div>
			<h2 className='mt-10 text-3xl'>Overview</h2>
			<SWREditorWrapper
				toolbarVisible
				query={supabase
					.from('timelines')
					.select('*')
					.eq('id', router.query.tid)
					.single()}
				plaintext='overview_plaintext'
				content='overview'
			/>
			<h2 className='mt-10 text-3xl'>Timeline</h2>
			<div className='card bg-base-200'>
				<ul ref={animationParent} className='relative card-body p-4'>
					<div className='absolute w-[1px] inset-0 mx-auto bg-primary'></div>
					{eventlist.data?.length > 0 &&
						eventlist.data
							.sort((a: any, b: any) => {
								console.log(a, b)
								return a.date - b.date
							})
							.map((ev: any, i: any) => (
								<Event key={ev.id} id={ev.id} index={i} />
							))}
				</ul>
				<AddEvent />
			</div>
		</>
	)
}

function AddEvent() {
	const router = useClientRouter()
	const timeline = useSWRQuery(
		supabase.from('timelines').select('*').eq('id', router.query.tid).single()
	)
	const eventlist = useSWRQuery(
		supabase.from('events').select('*').eq('timeline_id', router.query.tid)
	)

	const startTime = timeline.data?.startdate ? timeline.data?.startdate : null
	let days = null
	let hours = null
	if (startTime) {
		const date = new Date(startTime)
		const isostr = date.toISOString()
		days = isostr.split('T')[0]
		hours = isostr.split('T')[1].substring(0, 5)
	}

	const name = useRef<HTMLInputElement | null>(null)
	const date = useRef<HTMLInputElement | null>(null)
	const time = useRef<HTMLInputElement | null>(null)

	async function addEvent() {
		const day = date.current.value
		const hour = time.current.value
		const combined = day + ',' + hour
		const formatted = combined
			.split('-')
			.join(',')
			.split(' ')
			.join(',')
			.split(':')
			.join(',')
			.split(',')
		const finalDate = Date.UTC(...formatted)

		if (name.current.value.length > 2) {
			try {
				const { error } = await supabase.from('events').insert({
					name: name.current.value,
					campaign_id: router.query.cid,
					timeline_id: router.query.tid,
					date: finalDate,
				})
				if (error) throw error
				toast.success('Event added')
				eventlist.mutate()
			} catch (error) {
				toast.error('Could not create event.')
				console.error(error)
			}
		}
	}

	return (
		<Dialog>
			<DialogTrigger asChild>
				<button className='btn btn-circle text-2xl mx-auto mb-2'>+</button>
			</DialogTrigger>
			<DialogContent title='Add event'>
				<div className='space-y-2'>
					<label className='block'>
						<div>Event Name</div>
						<input ref={name} className='input input-primary w-full' />
					</label>
					<label className='block'>
						<div>Event date and time</div>
						<input
							ref={date}
							type='date'
							className='input input-primary'
							defaultValue={days}
						/>
						<input
							ref={time}
							type='time'
							className='input input-primary'
							defaultValue={hours}
						/>
					</label>
					<button onClick={() => addEvent()} className='btn btn-primary'>
						Create
					</button>
				</div>
			</DialogContent>
		</Dialog>
	)
}

function isEven(n: number) {
	return n % 2 == 0
}

function Event({ id, index }: any) {
	const query = supabase.from('events').select('*').eq('id', id).single()
	const event = useSWRQuery(query)

	if (!event.loaded) return <div></div>

	const date = dayjs.utc(event.data.date).format('YYYY MMM DD, hh:mma')

	return (
		<div className='grid lg:grid-cols-2 gap-5 mb-5'>
			<div className={`${isEven(index) && 'hidden'}`}></div>
			<div className=' relative bg-base-300 p-2 rounded-md'>
				<EditableDiv query={query} field='name' inputClassName='text-2xl' />
				<EditableDate query={query} field='date' />
				{event.data.id && (
					<SWREditorWrapper
						maxHeight='300px'
						minHeight='150px'
						query={queries.event.query(event.data.id)}
						plaintext='overview_plaintext'
						content='overview'
					/>
				)}
			</div>
		</div>
	)
}

Timeline.getLayout = function getLayout(page: React.ReactNode) {
	return <Layout>{page}</Layout>
}
