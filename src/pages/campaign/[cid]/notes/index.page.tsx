import { LoadingSpinner } from '@/common/components/loading'
import { pluralizeType } from '@/common/functions/pluralizeType'
import { useClientRouter } from '@/common/hooks/useClientRouter'
import { useSupabaseQuery } from '@/common/hooks/useSupabaseQuery'
import supabase from '@/modules/supabase'
import Link from 'next/link'
import { Layout } from '../layout'
import { AddNote } from './AddNote'

type NoteList = {
	name: string
	type: string
	id: string
	campaign_id: string
}

export default function Notes() {
	const router = useClientRouter()
	const type = router.query.type
	const notes = useSupabaseQuery<NoteList>(
		'notes',
		supabase
			.from('documents')
			.select('name, type, id')
			.eq('campaign_id', router.query.cid)
	)

	return (
		<div className='card bg-base-200'>
			<div className='card-body'>
				<div className='flex justify-between'>
					<h2 className='card-title font-heading'>
						<span className='capitalize'>
							{pluralizeType(type as string) ?? 'Notes'}
						</span>
					</h2>
					<AddNote />
				</div>
				<ul className='space-y-1'>
					{notes.isLoading && <LoadingSpinner />}
					{notes.isSuccess &&
						notes.data
							.filter((note) => (type ? note.type === type : true))
							.map((note) => (
								<li
									key={note.id}
									className='flex justify-between items-center p-2 bg-base-300 rounded-md text-lg'>
									<span>
										{note.name}, <span className='text-sm'>{note.type}</span>
									</span>
									<Link href={`/campaign/${router.query.cid}/notes/${note.id}`}>
										<button className='btn btn-sm'>open</button>
									</Link>
								</li>
							))}
				</ul>
			</div>
		</div>
	)
}

Notes.getLayout = function getLayout(page: React.ReactNode) {
	return <Layout>{page}</Layout>
}
