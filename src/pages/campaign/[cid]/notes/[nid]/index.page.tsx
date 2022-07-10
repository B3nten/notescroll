import { useClientRouter } from '@/common/hooks/useClientRouter'
import { Layout } from '../../layout'
import { Menu } from './Menu'
import { useSupabaseQuery } from '@/common/hooks/useSupabaseQuery'
import { RichtextWrapper } from '@/modules/tiptap/wrappers/RichtextWrapper'
import * as Autosave from '@/modules/autosave'
import { queryBuilder } from '@/common/queries/queryBuilder'

export default function Note() {
	const router = useClientRouter()
	const [noteKey, noteQuery] = queryBuilder.notes.single(router.query.nid as string)
	const note = useSupabaseQuery(noteKey, noteQuery)
	return (
		<>
			<div className='flex items-center justify-between'>
				<h1 className='font-heading text-4xl'>
					<Autosave.String query={noteQuery} field='name' queryKey={noteKey} />
				</h1>
				<Menu />
			</div>
			<div
				className={`my-10 card card-body p-4 bg-base-200 transition duration-500 ${
					note.isLoading && 'blur-sm'
				}`}>
				<h2 className='text-xl'>Details</h2>
				<p>Type: {note.data?.type || 'Character'}</p>
				<p>Last updated: {new Date(note.data?.updated_at || 0).toString()}</p>
				<p>
					Tags:{' '}
					{note.data?.tags?.map((tag: string, i: number) => (
						<span key={i}>
							{tag}
							{note.data?.tags && i === note.data?.tags?.length - 1 ? '' : ','}{' '}
						</span>
					))}
				</p>
			</div>
			<RichtextWrapper queryKey={noteKey} field='overview' query={noteQuery} toolbarVisible />
		</>
	)
}

Note.getLayout = function getLayout(page: React.ReactNode) {
	return <Layout>{page}</Layout>
}
