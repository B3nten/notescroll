import { useClientRouter } from '@/common/hooks/useClientRouter'
import * as Autosave from '@/modules/autosave'
import { Layout } from '../../layout'
import { Menu } from './Menu'
import { Dialog, DialogTrigger, DialogContent } from '@/common/components/dialog'
import { useRef } from 'react'
import toast from 'react-hot-toast'
import supabase from '@/modules/supabase'
import { EditableDate } from '@/common/components/inputs/EditableDate'
import * as dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { LoadingSpinner } from '@/common/components/loading'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { useSupabaseQuery } from '@/common/hooks/useSupabaseQuery'
import { definitions } from '@/types/database'
import { timelinesKeyBuilder } from '@/common/hooks/queries/timelines'
import { RichtextWrapper } from '@/modules/tiptap/wrappers/RichtextWrapper'
dayjs.extend(utc)

export default function Timeline() {
	const router = useClientRouter()
	const [animateList] = useAutoAnimate()
	const timelineQuery = supabase
		.from<definitions['timelines']>('timelines')
		.select('*')
		.eq('id', router.query.tid as string)
		.single()
	const eventListQuery = supabase
		.from<definitions['events']>('events')
		.select('id, date')
		.eq('timeline_id', router.query.tid as string)

	const timeline = useSupabaseQuery(
		timelinesKeyBuilder.single(router.query.tid as string),
		timelineQuery
	)
	const eventlist = useSupabaseQuery(['events', router.query.tid], eventListQuery)

	if (timeline.isLoading) return <LoadingSpinner />

	const startdate = dayjs.utc(timeline.data?.startdate).format('YYYY MMM DD, hh:mma')
	return (
		<>
			<div className='flex items-center justify-between'>
				<div>
					<h1 className='font-heading text-4xl'>
						<Autosave.String
							query={timelineQuery}
							queryKey={timelinesKeyBuilder.single(router.query.tid as string)}
							field='name'
						/>
					</h1>
					<div className='px-2'>Starting date: {startdate}</div>
				</div>
				<Menu />
			</div>
			<h2 className='mt-10 text-3xl'>Overview</h2>
			<RichtextWrapper
				query={timelineQuery}
				queryKey={timelinesKeyBuilder.single(router.query.tid as string)}
				field='overview'
				toolbarVisible
			/>
			<h2 className='mt-10 text-3xl'>Timeline</h2>
			<div className='card bg-base-200'>
				<ul ref={animateList} className='relative card-body p-4'>
					<>
						<div className='absolute w-[1px] inset-0 mx-auto bg-primary'></div>
						{eventlist.data
							?.sort((a: any, b: any) => {
								return a.date - b.date
							})
							.map((ev: any, i: any) => (
								<Event key={ev.id} id={ev.id} index={i} />
							))}
					</>
				</ul>
				<AddEvent />
			</div>
		</>
	)
}

function AddEvent() {
	const router = useClientRouter()

	const timeline = useSupabaseQuery(
		['timelines', router.query.tid],
		supabase.from('timelines').select('*').eq('id', router.query.tid).single()
	)
	const eventlist = useSupabaseQuery(
		['events', router.query.tid],
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
		const day = date.current?.value
		const hour = time.current?.value
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

		if (name.current?.value?.length > 2) {
			try {
				const { error } = await supabase.from('events').insert({
					name: name.current?.value,
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
						<input ref={date} type='date' className='input input-primary' defaultValue={days} />
						<input ref={time} type='time' className='input input-primary' defaultValue={hours} />
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
	const query = supabase.from<definitions['events']>('events').select('*').eq('id', id).single()
	const event = useSupabaseQuery(['event', id], query)
	const date = dayjs.utc(event.data?.date).format('YYYY MMM DD, hh:mma')

	return (
		<div
			className={`mb-5 transition duration-1000 ${isEven(index) ? 'xl:pr-4' : 'xl:pl-4'} ${
				event.isLoading && 'blur-sm'
			}`}>
			<div
				className={`relative transition-all duration-1000 bg-base-300 p-2 rounded-md xl:w-1/2 ${
					!isEven(index) && 'xl:translate-x-[100%]'
				}`}>
				<div className='text-3xl'>
					<Autosave.String query={query} queryKey={['event', id]} field='name' />
				</div>
				<EditableDate query={query} field='date' eventID={id} />
				<RichtextWrapper query={query} queryKey={['event', id]} field='overview' />
			</div>
		</div>
	)
}

Timeline.getLayout = function getLayout(page: React.ReactNode) {
	return <Layout>{page}</Layout>
}
