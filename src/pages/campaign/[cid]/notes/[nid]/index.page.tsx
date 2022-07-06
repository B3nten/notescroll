import { useClientRouter } from '@/common/hooks/useClientRouter'
import { Layout } from '../../layout'
import { Menu } from './Menu'
import supabase from '@/modules/supabase'
import { useSupabaseQuery } from '@/common/hooks/useSupabaseQuery'
import { RichtextWrapper } from '@/modules/tiptap/wrappers/RichtextWrapper'
import * as Autosave from '@/modules/autosave'
import { definitions } from '@/types/database'

export default function Note() {
	const router = useClientRouter()
	const query = supabase
		.from<definitions['documents']>('documents')
		.select('*')
		.eq('id', router.query.nid as string)
		.single()
	const note = useSupabaseQuery(['notes', router.query.nid], query)
	return (
		<>
			<div className='flex items-center justify-between'>
				<h1 className='font-heading text-4xl'>
					<Autosave.String query={query} field='name' queryKey={['note', router.query.nid]} />
				</h1>
				<Menu />
			</div>
			<div
				className={`my-10 h-32 card card-body p-4 bg-base-200 transition duration-500 ${
					note.isLoading && 'blur-sm'
				}`}>
				<h2 className='text-xl'>Details</h2>
				<p>Type: {note.data?.type || 'Character'}</p>
				<p>Last updated: {new Date(note.data?.updated_at || 0).toString()}</p>
			</div>
			<RichtextWrapper
				queryKey={['note', router.query.nid]}
				field='overview'
				query={query}
				toolbarVisible
			/>
		</>
	)
}

Note.getLayout = function getLayout(page: React.ReactNode) {
	return <Layout>{page}</Layout>
}
