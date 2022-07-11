import { useClientRouter } from '@/common/hooks/useClientRouter'
import { useSupabaseQuery } from '@/common/hooks/useSupabaseQuery'
import Link from 'next/link'
import { Layout } from '../layout'
import supabase from '@/modules/supabase/index'
import { useQueryClient } from 'react-query'
import { Dialog, DialogContent, DialogTrigger } from '@/common/components/dialog'
import { useState, useRef } from 'react'
import toast from 'react-hot-toast'
import { useMutation } from 'react-query'
import { LoadingSpinner } from '@/common/components/loading'
import { queryBuilder } from '@/common/queries/queryBuilder'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { TagViewer } from '@/modules/ui/tags'

// export default function Timelines() {
// 	const router = useClientRouter()
// 	const queryClient = useQueryClient()
// 	const timelines = useTimelineList(router.query.cid as string)
// 	console.log(timelines)
// 	return (
// 		<div className='card bg-base-200'>
// 			<div className='card-body'>
// 				<div className='flex justify-between'>
// 					<h2 className='card-title font-heading'>Timelines</h2>
// 					<AddTimeline />
// 				</div>
// 				<ul className='space-y-1'>
// 					{timelines.isSuccess &&
// 						timelines.data?.map(tl => (
// 							<li
// 								key={tl.id}
// 								className='flex justify-between items-center p-2 bg-base-300 rounded-md text-lg'>
// 								<span>{tl.name}</span>
// 								<Link href={`/campaign/${router.query.cid}/timelines/${tl.id}`}>
// 									<button
// 										onMouseEnter={async () => {
// 											await queryClient.prefetchQuery(
// 												timelinesKeyBuilder.single(tl.id),
// 												async () => {
// 													const { data, error } = await supabase
// 														.from('timelines')
// 														.select('*')
// 														.eq('id', tl.id)
// 														.single()
// 													if (error) throw error
// 													return data
// 												}
// 											)
// 											await queryClient.prefetchQuery(
// 												eventsKeyBuilder.list(tl.id),
// 												async () => {
// 													const { data, error } = await supabase
// 														.from('events')
// 														.select('id')
// 														.eq('timeline_id', tl.id)
// 													if (error) throw error
// 													return data
// 												}
// 											)
// 										}}
// 										className='btn btn-sm'>
// 										open
// 									</button>
// 								</Link>
// 							</li>
// 						))}
// 				</ul>
// 			</div>
// 		</div>
// 	)
// }

export default function Timelines() {
	const router = useClientRouter()
	const queryClient = useQueryClient()
	const [queryKey, queryFn] = queryBuilder.timelines.campaign(router.query.cid as string)
	const list = useSupabaseQuery(queryKey, queryFn)

	const [animateRef] = useAutoAnimate<any>()

	function getRouterTagsAsArray(): string[] {
		let routerTags: string[] = []
		if (router.query.tags && router.query.tags.length > 0) {
			if (Array.isArray(router.query.tags)) {
				routerTags = router.query.tags
			} else {
				routerTags = [router.query.tags]
			}
		}
		return routerTags
	}

	function sortFilterList() {
		if (!list.data) return list.data

		let newList = list.data

		if (router.query.sort === 'name') {
			newList.sort((a: any, b: any) => a.name.localeCompare(b.name))
		} else {
			newList.sort(
				(a: any, b: any) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
			)
		}

		if (router.query.tags && router.query.tags.length > 0) {
			newList = newList.filter(item =>
				getRouterTagsAsArray().every(tag => item.tags?.includes(tag as string))
			)
		}

		return newList
	}

	function getAllDocumentTags() {
		const set = new Set<string>()
		list.data?.forEach(item => item.tags?.forEach(t => set.add(t)))
		return Array.from(set)
	}

	const tagMutation = useMutation(
		async ({ tid, tags }: { tid: string; tags: string[] }) => {
			const { data, error } = await supabase
				.from('timelines')
				.update({ tags: tags })
				.eq('id', tid)
			if (error) throw error
			return data
		},
		{
			onSuccess: () => {
				list.refetch()
			},
		}
	)

	const [tagFilter, setTagFilter] = useState<string[]>([])

	function addTagToFilter(tag: string) {
		const newTagFilter = new Set(tagFilter)
		newTagFilter.add(tag)
		setTagFilter(Array.from(newTagFilter))
		router.replace({ query: { ...router.query, tags: Array.from(newTagFilter) } })
	}
	function removeTagFromFilter(tag: string) {
		const newTagFilter = new Set(tagFilter)
		newTagFilter.delete(tag)
		setTagFilter(Array.from(newTagFilter))
		router.replace({ query: { ...router.query, tags: Array.from(newTagFilter) } })
	}

	return (
		<div className='card bg-base-200'>
			<div className='card-body'>
				<div className='flex justify-between'>
					<div className='flex justify-center items-center space-x-4'>
						<h2 className='card-title font-heading'>
							<span className='capitalize'>Timelines</span>
						</h2>
						<TagViewer
							tags={getAllDocumentTags()}
							onTagClick={t => addTagToFilter(t)}
							display
						/>
						<div className='space-x-1 space-y-1'>
							{tagFilter &&
								tagFilter.map((tag: string, i: number) => (
									<button
										key={i + tag}
										onClick={() => removeTagFromFilter(tag)}
										className='bg-primary px-1 rounded-md text-primary-content'>
										{tag}{' '}
									</button>
								))}
						</div>
					</div>
					<AddTimeline />
				</div>
				<ul className='space-y-1' ref={animateRef}>
					{list.isLoading && <LoadingSpinner />}
					{list.isSuccess &&
						sortFilterList()?.map((item: any) => (
							<li
								key={item.id}
								className='flex justify-between items-center p-2 bg-base-300 rounded-md text-lg'>
								<div className='flex items-center justify-center space-x-4'>
									<span>{item.name}</span>
									<TagViewer
										tags={item.tags}
										showTags
										onTagAdd={tags => tagMutation.mutate({ tid: item.id, tags: tags })}
										onTagRemove={tags => tagMutation.mutate({ tid: item.id, tags: tags })}
									/>
								</div>
								<Link href={`/campaign/${router.query.cid}/timelines/${item.id}`}>
									<button className='btn btn-sm'>open</button>
								</Link>
							</li>
						))}
				</ul>
			</div>
		</div>
	)
}

function AddTimeline() {
	const router = useClientRouter()

	const [addNoteDialog, setAddNoteDialog] = useState(false)

	const nameRef = useRef<any>(null)

	const insertTimeline = useMutation(
		async () => {
			if (nameRef.current?.value.length > 3) {
				const { data, error } = await supabase
					.from('timelines')
					.insert({
						name: nameRef.current.value,
						campaign_id: router.query.cid,
					})
					.single()
				if (error) throw error
				return data
			} else {
				throw new Error('Invalid timeline name')
			}
		},
		{
			onError: error => {
				let message = 'An unknown error occured'
				if (error instanceof Error) message = error.message
				toast.error(message)
			},
			onSuccess: data => {
				router.push(`/campaign/${router.query.cid}/timelines/${data.id}`)
			},
		}
	)

	return (
		<Dialog open={addNoteDialog}>
			<DialogTrigger asChild>
				<button
					onClick={() => setAddNoteDialog(true)}
					className='btn btn-sm btn-circle text-2xl'>
					+
				</button>
			</DialogTrigger>
			<DialogContent title='New Timeline' setOpen={setAddNoteDialog}>
				<>
					<div className='flex flex-col items-start space-y-2'>
						<label className='flex flex-col'>
							Name
							<input ref={nameRef} autoFocus className='input input-primary' />
						</label>
					</div>
					<button
						onClick={() => insertTimeline.mutate()}
						className='btn btn-secondary mt-5 transition'>
						<div className='flex space-x-3'>
							<span>Add</span>
							{insertTimeline.isLoading && <LoadingSpinner />}
						</div>
					</button>
				</>
			</DialogContent>
		</Dialog>
	)
}

Timelines.getLayout = function getLayout(page: React.ReactNode) {
	return <Layout>{page}</Layout>
}
