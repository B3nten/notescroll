import { Layout } from '../../layout'
import { useSupabaseQuery } from '@/common/hooks/useSupabaseQuery'
import { RichtextWrapper } from '@/modules/tiptap/wrappers/RichtextWrapper'
import * as Autosave from '@/modules/autosave'
import { queryBuilder } from '@/common/queries/queryBuilder'
import {
	Dropdown,
	DropdownContent,
	DropdownItem,
	DropdownTrigger,
} from '@/common/components/dropdown'
import { useClientRouter } from '@/common/hooks/useClientRouter'
import { Dialog, DialogContent } from '@/common/components/dialog'
import { useState } from 'react'
import { useKeydown } from '@/common/hooks/useKeydown'
import supabase from '@/modules/supabase'
import toast from 'react-hot-toast'
import { GiGearHammer } from 'react-icons/gi'
import { useMutation } from 'react-query'
import { LoadingSpinner } from '@/common/components/loading'

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

function Menu() {
	const router = useClientRouter()
	const [delNoteDialog, setDelNoteDialog] = useState(false)
	useKeydown('Escape', () => setDelNoteDialog(false))

	const deleteNote = useMutation(
		async () => {
			const { data, error } = await supabase
				.from('documents')
				.delete()
				.eq('id', router.query.nid)
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
				router.push(`/campaign/${router.query.cid}/notes`)
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
						<button className='btn btn-ghost' onClick={() => setDelNoteDialog(true)}>
							Delete note
						</button>
					</DropdownItem>
				</DropdownContent>
			</Dropdown>
			<Dialog open={delNoteDialog}>
				<DialogContent title='Delete note' setOpen={setDelNoteDialog}>
					Are you sure? The note cannot be recovered.
					<div className='space-x-2 mt-5 flex justify-center'>
						<button onClick={() => setDelNoteDialog(false)} className='btn btn-ghost w-20'>
							No
						</button>
						<button onClick={() => deleteNote.mutate()} className='btn btn-error w-20'>
							<div className='flex space-x-2'>
								<span>Yes</span>
								{deleteNote.isLoading && <LoadingSpinner />}
							</div>
						</button>
					</div>
				</DialogContent>
			</Dialog>
		</>
	)
}

Note.getLayout = function getLayout(page: React.ReactNode) {
	return <Layout>{page}</Layout>
}
