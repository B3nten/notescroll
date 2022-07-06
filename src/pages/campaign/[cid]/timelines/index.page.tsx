import { useClientRouter } from '@/common/hooks/useClientRouter'
import { useSupabaseQuery } from '@/common/hooks/useSupabaseQuery'
import Link from 'next/link'
import { Layout } from '../layout'
import { AddTimeline } from './AddTimeline'
import supabase from '@/modules/supabase/index'
import { definitions } from '@/types/database'
import { useQueryClient } from 'react-query'
import { timelinesKeyBuilder, useTimelineList } from '@/common/hooks/queries/timelines'
import { eventsKeyBuilder } from '@/common/hooks/queries/events'

export default function Timelines() {
	const router = useClientRouter()
	const queryClient = useQueryClient()
	const timelines = useTimelineList(router.query.cid as string)
	console.log(timelines)
	return (
		<div className='card bg-base-200'>
			<div className='card-body'>
				<div className='flex justify-between'>
					<h2 className='card-title font-heading'>Timelines</h2>
					<AddTimeline />
				</div>
				<ul className='space-y-1'>
					{timelines.isSuccess &&
						timelines.data?.map(tl => (
							<li
								key={tl.id}
								className='flex justify-between items-center p-2 bg-base-300 rounded-md text-lg'>
								<span>{tl.name}</span>
								<Link href={`/campaign/${router.query.cid}/timelines/${tl.id}`}>
									<button
										onMouseEnter={async () => {
											await queryClient.prefetchQuery(
												timelinesKeyBuilder.single(tl.id),
												async () => {
													const { data, error } = await supabase
														.from('timelines')
														.select('*')
														.eq('id', tl.id)
														.single()
													if (error) throw error
													return data
												}
											)
											await queryClient.prefetchQuery(eventsKeyBuilder.list(tl.id), async () => {
												const { data, error } = await supabase
													.from('events')
													.select('id')
													.eq('timeline_id', tl.id)
												if (error) throw error
												return data
											})
										}}
										className='btn btn-sm'>
										open
									</button>
								</Link>
							</li>
						))}
				</ul>
			</div>
		</div>
	)
}

Timelines.getLayout = function getLayout(page: React.ReactNode) {
	return <Layout>{page}</Layout>
}
