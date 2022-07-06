import { useClientRouter } from '@/common/hooks/useClientRouter'
import { useSupabaseQuery } from '@/common/hooks/useSupabaseQuery'
import Link from 'next/link'
import { Layout } from '../layout'
import { AddTimeline } from './AddTimeline'
import supabase from '@/modules/supabase/index'
import { definitions } from '@/types/database'

export default function Timelines() {
	const router = useClientRouter()
	const timelines = useSupabaseQuery(
		['timelines'],
		supabase
			.from<definitions['timelines']>('timelines')
			.select('name, id')
			.eq('campaign_id', router.query.cid as string)
	)

	return (
		<div className='card bg-base-200'>
			<div className='card-body'>
				<div className='flex justify-between'>
					<h2 className='card-title font-heading'>Timelines</h2>
					<AddTimeline />
				</div>
				<ul className='space-y-1'>
					{timelines.isSuccess &&
						timelines.data.map(tl => (
							<li
								key={tl.id}
								className='flex justify-between items-center p-2 bg-base-300 rounded-md text-lg'>
								<span>{tl.name}</span>
								<Link href={`/campaign/${router.query.cid}/timelines/${tl.id}`}>
									<button className='btn btn-sm'>open</button>
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
