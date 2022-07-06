import { Dialog, DialogContent, DialogTrigger } from '@/common/components/dialog'
import { useClientRouter } from '@/common/hooks/useClientRouter'
import { useState, useRef } from 'react'
import toast from 'react-hot-toast'
import supabase from '@/modules/supabase'
import { useSupabaseQuery } from '@/common/hooks/useSupabaseQuery'
import { definitions } from '@/types/database'

export function AddTimeline() {
	const router = useClientRouter()
	const campaign = useSupabaseQuery(
		['campaigns', router.query.cid],
		supabase
			.from<definitions['campaigns']>('campaigns')
			.select('*')
			.eq('campaign_id', router.query.cid as string)
			.single()
	)
	const [addNoteDialog, setAddNoteDialog] = useState(false)
	const [noName, setNoName] = useState(false)
	const nameRef = useRef<any>()
	const dateRef = useRef<any>()

	const date = new Date(campaign.data?.startdate || 0).toISOString().split('T')[0]
	console.log(date)

	async function addNote() {
		if (nameRef.current?.value.length > 3) {
			try {
				const { data, error } = await supabase
					.from('timelines')
					.insert({
						name: nameRef.current.value,
						startdate: dateRef.current.valueAsNumber,
						campaign_id: router.query.cid,
					})
					.single()
				if (error) throw error
				toast.success('Timeline created')
				console.log(data)
				router.push(`/campaign/${router.query.cid}/timelines/${data.id}`)
			} catch (error) {}
		} else {
			setNoName(true)
		}
	}

	return (
		<Dialog open={addNoteDialog}>
			<DialogTrigger asChild>
				<button onClick={() => setAddNoteDialog(true)} className='btn btn-sm btn-circle text-2xl'>
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
						<label className='flex flex-col'>
							Starting date
							<input
								ref={dateRef}
								type='date'
								className='input input-primary'
								defaultValue={date}
							/>
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
