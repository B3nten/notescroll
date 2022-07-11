import { useClientRouter } from '@/common/hooks/useClientRouter'
import { useSupabaseQuery } from '@/common/hooks/useSupabaseQuery'
import { queryBuilder } from '@/common/queries/queryBuilder'
import { RichtextWrapper } from '@/modules/tiptap/wrappers/RichtextWrapper'
import { Layout } from './layout'

export default function Campaign() {
	const router = useClientRouter()

	const [notesKey, notesQuery] = queryBuilder.notes.campaign(router.query.cid as string)
	const [timelinesKey, timelinesQuery] = queryBuilder.timelines.campaign(
		router.query.cid as string
	)
	const [campaignKey, campaignQuery] = queryBuilder.campaigns.single(router.query.cid as string)

	const recentNotes = useSupabaseQuery(notesKey, notesQuery)
	const recentTimelines = useSupabaseQuery(timelinesKey, timelinesQuery)
	const campaign = useSupabaseQuery(campaignKey, campaignQuery)
	console.log(campaign)
	return (
		<div className='grid grid-cols-2 gap-4'>
			<div className='card bg-base-200'>
				<div className='card-body'>
					<div className='card-title'>Recent Notes</div>
					<div>
						<ul>
							{recentNotes.data
								?.filter((e, i) => i < 5)
								.map(note => (
									<li
										className='text-lg bg-base-300 p-2 mb-2 rounded-md flex justify-between items-center'
										key={note.id}>
										<span>{note.name}</span>
										<button
											onClick={() =>
												router.push(`/campaign/${router.query.cid}/notes/${note.id}`)
											}
											className='btn btn-sm'>
											Open
										</button>
									</li>
								))}
						</ul>
					</div>
				</div>
			</div>
			<div className='card bg-base-200'>
				<div className='card-body'>
					<div className='card-title'>Recent Timelines</div>
					<div>
						<ul>
							{recentTimelines.data
								?.filter((e, i) => i < 5)
								.map(note => (
									<li
										className='text-lg bg-base-300 p-2 mb-2 rounded-md flex justify-between items-center'
										key={note.id}>
										<span>{note.name}</span>
										<button
											onClick={() =>
												router.push(
													`/campaign/${router.query.cid}/timelines/${note.id}`
												)
											}
											className='btn btn-sm'>
											Open
										</button>
									</li>
								))}
						</ul>
					</div>
				</div>
			</div>
			<div className='col-span-2 mt-10'>
				<h2 className='text-2xl'>Campaign Overview</h2>
				<RichtextWrapper
					minHeight='500px'
					field='overview'
					query={campaignQuery}
					queryKey={campaignKey}
					toolbarVisible
				/>
			</div>
			<div>
				<div className='card bg-base-200'>
					<div className='card-body'>
						<div className='card-title'>GIF of the day</div>
						<div>
							<iframe
								src='https://giphy.com/embed/3osBL9Hiir653jjmKc'
								frameBorder='0'
								className='w-full h-full'
								allowFullScreen
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

Campaign.getLayout = function getLayout(page: React.ReactNode) {
	return <Layout>{page}</Layout>
}
