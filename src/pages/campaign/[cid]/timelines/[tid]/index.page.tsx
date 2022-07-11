import { useClientRouter } from '@/common/hooks/useClientRouter'
import * as Autosave from '@/modules/autosave'
import { Layout } from '../../layout'
import { Dialog, DialogTrigger, DialogContent } from '@/common/components/dialog'
import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import supabase from '@/modules/supabase'
import { LoadingSpinner } from '@/common/components/loading'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { useSupabaseQuery } from '@/common/hooks/useSupabaseQuery'
import { RichtextWrapper } from '@/modules/tiptap/wrappers/RichtextWrapper'
import { queryBuilder } from '@/common/queries/queryBuilder'
import { useMutation, useQueryClient } from 'react-query'
import { GiArrowhead } from 'react-icons/gi'
import produce from 'immer'
import {
	Dropdown,
	DropdownContent,
	DropdownItem,
	DropdownTrigger,
} from '@/common/components/dropdown'
import { useKeydown } from '@/common/hooks/useKeydown'
import { GiGearHammer } from 'react-icons/gi'
import { BiTrash } from 'react-icons/bi'

export default function Timeline() {
	const router = useClientRouter()
	const [animateList] = useAutoAnimate<any>()

	const [timelineKey, timelineQuery] = queryBuilder.timelines.single(router.query.tid as string)
	const [eventListKey, eventListQuery] = queryBuilder.events.timeline(router.query.tid as string)

	const [statefulEventList, updateStatefulEventList] = useState<object[] | undefined>(undefined)

	const timeline = useSupabaseQuery(timelineKey, timelineQuery)

	const eventlist = useSupabaseQuery(eventListKey, eventListQuery, {
		onSuccess(data) {
			const sortedData = [...data]
			updateStatefulEventList(
				sortedData.sort((a, b) => (a.index as number) - (b.index as number))
			)
		},
	})

	function mutateEventOrder(index: number, action: string) {
		if (statefulEventList) {
			const newState = produce(statefulEventList, draft => {
				if (action === 'up' && index !== 0) {
					const element = draft[index]
					draft.splice(index, 1)
					draft.splice(index - 1, 0, element)
				}
				if (action === 'down') {
					const element = draft[index]
					draft.splice(index, 1)
					draft.splice(index + 1, 0, element)
				}
			})
			updateStatefulEventList(newState)
		}
	}

	if (timeline.isLoading) return <LoadingSpinner />

	return (
		<>
			<div className='flex items-center justify-between'>
				<div>
					<h1 className='font-heading text-4xl'>
						<Autosave.String query={timelineQuery} queryKey={timelineKey} field='name' />
					</h1>
				</div>
				<Menu />
			</div>
			<h2 className='mt-10 text-3xl'>Overview</h2>
			<RichtextWrapper
				query={timelineQuery}
				queryKey={timelineKey}
				field='overview'
				toolbarVisible
			/>
			<h2 className='mt-10 text-3xl'>Timeline</h2>
			<div className='card bg-base-200'>
				<ul ref={animateList} className='relative card-body p-4'>
					<>
						<div className='absolute w-[1px] inset-0 mx-auto bg-primary'></div>
						{statefulEventList?.map((ev: any, i: any) => (
							<li key={ev.id}>
								<Event mutateEventOrder={mutateEventOrder} id={ev.id} index={i} />
							</li>
						))}
					</>
				</ul>
				<AddEvent />
			</div>
		</>
	)
}

function Menu() {
	const router = useClientRouter()
	const [delTimelineDialog, setDelTimelineDialog] = useState(false)
	useKeydown('Escape', () => setDelTimelineDialog(false))

	const deleteTimeline = useMutation(
		async () => {
			const { data, error } = await supabase
				.from('timelines')
				.delete()
				.eq('id', router.query.tid)
			if (error) throw error
			return data
		},
		{
			onError: error => {
				let message = 'An unknown error occured'
				if (error instanceof Error) message = error.message
				toast.error(message)
			},
			onSuccess: () => {
				router.push(`/campaign/${router.query.cid}/timelines`)
			},
		}
	)

	return (
		<>
			<Dropdown>
				<DropdownTrigger asChild>
					<button className='btn btn-sm'>
						<GiGearHammer className='fill-secondary stroke-secondary w-6 h-6' />
					</button>
				</DropdownTrigger>
				<DropdownContent>
					<DropdownItem>
						<button className='btn btn-ghost' onClick={() => setDelTimelineDialog(true)}>
							Delete timeline
						</button>
					</DropdownItem>
				</DropdownContent>
			</Dropdown>
			<Dialog open={delTimelineDialog}>
				<DialogContent title='Delete timeline' setOpen={setDelTimelineDialog}>
					Are you sure? The timeline and associated events be recovered.
					<div className='space-x-2 mt-5 flex justify-center'>
						<button
							onClick={() => setDelTimelineDialog(false)}
							className='btn btn-ghost w-20'>
							No
						</button>
						<button onClick={() => deleteTimeline.mutate()} className='btn btn-error w-20'>
							<div className='flex space-x-2'>
								<span>Yes</span>
								{deleteTimeline.isLoading && <LoadingSpinner />}
							</div>
						</button>
					</div>
				</DialogContent>
			</Dialog>
		</>
	)
}

function AddEvent() {
	const router = useClientRouter()
	const queryClient = useQueryClient()
	const [eventListKey, eventListQuery] = queryBuilder.events.timeline(router.query.tid as string)

	const [addEventDialog, setAddEventDialog] = useState(false)
	const name = useRef<any>(null)
	const insertEvent = useMutation(
		async ({ eventname }: { eventname: string | null | undefined }) => {
			if (eventname && eventname.length > 2) {
				const { error, data } = await supabase.from('events').insert({
					name: eventname,
					campaign_id: router.query.cid,
					timeline_id: router.query.tid,
				})
				if (error) throw error
				return data
			} else {
				throw new Error('Improper event name')
			}
		},
		{
			onError: error => {
				let message = 'Unknown error'
				if (error instanceof Error) {
					message = error.message
				}
				toast.error(message)
			},
			onSuccess: data => {
				toast.success('Added event')
				setAddEventDialog(false)
				queryClient.setQueryData(eventListKey, oldData => {
					const newData = [...(oldData as {}[])]
					newData.push(data[0])
					return newData
				})
			},
		}
	)

	return (
		<Dialog open={addEventDialog}>
			<DialogTrigger asChild>
				<button
					onClick={() => setAddEventDialog(true)}
					className='btn btn-circle text-2xl mx-auto mb-2'>
					+
				</button>
			</DialogTrigger>
			<DialogContent title='Add event' setOpen={setAddEventDialog}>
				<div className='space-y-2'>
					<label className='block'>
						<div>Event Name</div>
						<input ref={name} className='input input-primary w-full' />
					</label>
					<button
						onClick={() => insertEvent.mutate({ eventname: name.current?.value })}
						className='btn btn-primary'>
						<div>
							<span>Create</span>
							{insertEvent.isLoading && <LoadingSpinner />}
						</div>
					</button>
				</div>
			</DialogContent>
		</Dialog>
	)
}

function isEven(n: number) {
	return n % 2 == 0
}

function Event({
	id,
	index,
	mutateEventOrder,
}: {
	id: string
	index: number
	mutateEventOrder: (index: number, action: string) => void
}) {
	const router = useClientRouter()
	const queryClient = useQueryClient()
	const [eventListKey, eventListQuery] = queryBuilder.events.timeline(router.query.tid as string)
	const [eventKey, eventQuery] = queryBuilder.events.single(id)

	const event = useSupabaseQuery(eventKey, eventQuery, {
		onSettled: () => {},
	})

	const mutateIndex = useMutation(async () => {
		const { data, error } = await supabase.from('events').update({ index: index }).eq('id', id)
		if (error) throw error
		return data
	})

	const deleteEvent = useMutation(
		async () => {
			const { data, error } = await supabase.from('events').delete().eq('id', id)
			if (error) throw error
			return data
		},
		{
			onSuccess: () => {
				queryClient.setQueryData(eventListKey, (oldData: any) => {
					return oldData.filter((event: any) => event.id !== id)
				})
			},
		}
	)

	useEffect(() => {
		if (typeof event.data?.index === 'number' && index !== event.data.index) {
			mutateIndex.mutate()
		}
	}, [index])

	return (
		<div
			className={`mb-5 transition duration-1000 ${isEven(index) ? 'xl:pr-4' : 'xl:pl-4'} ${
				event.isLoading && 'blur-sm'
			}`}>
			<div
				className={`relative transition-all duration-1000 bg-base-300 p-2 rounded-md xl:w-1/2 ${
					!isEven(index) && 'xl:translate-x-[100%]'
				}`}>
				<div className='flex justify-between items-center'>
					<div className='text-3xl'>
						<Autosave.String query={eventQuery} queryKey={eventKey} field='name' />
					</div>
					<div className='flex'>
						<button
							onClick={() => mutateEventOrder(index, 'up')}
							className='p-2 hover:-translate-y-1 transition hover:bg-base-200 rounded-sm'>
							<GiArrowhead className='rotate-[225deg] ' />
						</button>
						<button
							onClick={() => mutateEventOrder(index, 'down')}
							className='p-2 hover:translate-y-1 transition hover:bg-base-200 rounded-sm'>
							<GiArrowhead className='rotate-45' />
						</button>
						<button
							onClick={() => deleteEvent.mutate()}
							className='p-2 transition hover:bg-base-200 rounded-sm'>
							{!deleteEvent.isLoading && <BiTrash />}
							{deleteEvent.isLoading && <LoadingSpinner />}
						</button>
					</div>
				</div>
				<RichtextWrapper query={eventQuery} queryKey={eventKey} field='overview' />
			</div>
		</div>
	)
}

Timeline.getLayout = function getLayout(page: React.ReactNode) {
	return <Layout>{page}</Layout>
}
