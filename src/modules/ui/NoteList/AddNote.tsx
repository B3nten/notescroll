import { Dialog, DialogContent, DialogTrigger } from '@/common/components/dialog'
import { useClientRouter } from '@/common/hooks/useClientRouter'
import { useState, useRef } from 'react'
import toast from 'react-hot-toast'
import supabase from '@/modules/supabase'

export function AddNote() {
	const router = useClientRouter()
	const [addNoteDialog, setAddNoteDialog] = useState(false)
	const [noName, setNoName] = useState(false)
	const nameRef = useRef<any>()
	const typeRef = useRef<any>()

	async function addNote() {
		if (nameRef.current?.value.length > 3) {
			try {
				const { data, error } = await supabase
					.from('documents')
					.insert({
						name: nameRef.current.value,
						type: typeRef.current.value,
						campaign_id: router.query.cid,
					})
					.single()
				if (error) throw error
				toast.success('Document created')
				console.log(data)
				router.push(`/campaign/${router.query.cid}/notes/${data.id}`)
			} catch (error) {
				toast.error(error.message)
			}
		} else {
			setNoName(true)
		}
	}

	return (
		<Dialog open={addNoteDialog}>
			<DialogTrigger asChild>
				<button
					onClick={() => setAddNoteDialog(true)}
					className='btn btn-sm btn-circle text-2xl'>
					+
				</button>
			</DialogTrigger>
			<DialogContent title='New Note' setOpen={setAddNoteDialog}>
				<>
					<div className='flex flex-col items-start space-y-2'>
						<label className='flex flex-col'>
							Name
							<input ref={nameRef} autoFocus className='input input-primary' />
						</label>
						<label className='flex flex-col'>
							Type
							<select ref={typeRef} className='select select-primary'>
								<option className='btn btn-sm' value='character'>
									Character
								</option>
								<option className='btn btn-sm' value='location'>
									Location
								</option>
								<option className='btn btn-sm' value='item'>
									Item
								</option>
								<option className='btn btn-sm' value='lore'>
									Lore
								</option>
								<option className='btn btn-sm' value='dream'>
									Dream
								</option>
								<option className='btn btn-sm' value='other'>
									Other
								</option>
							</select>
						</label>
					</div>
					<button onClick={addNote} className='btn btn-secondary mt-5'>
						Add
					</button>
				</>
			</DialogContent>
		</Dialog>
	)
}
