import { Loading, LoadingSpinner } from '@/common/components/loading'
import { useClientRouter } from '@/common/hooks/useClientRouter'
import { Dialog, DialogContent, DialogTrigger } from '@/common/components/dialog'
import { useRef, useState } from 'react'
import { useKeydown } from '@/common/hooks/useKeydown'
import supabase, { useSession } from '@/modules/supabase'
import toast from 'react-hot-toast'
import { logOut } from '@/modules/supabase'
import Settings from '@/modules/settings'
import { useSupabaseQuery } from '@/common/hooks/useSupabaseQuery'

export default function Index() {
	const campaigns = useSupabaseQuery(['campaigns'], supabase.from('campaigns').select('*'))
	const router = useClientRouter()
	const [newCampaignModal, setNewCampaignModal] = useState(false)
	const session = useSession()

	return (
		<>
			{session.session && (
				<div className='relative p-4 w-full mb-2 flex justify-end items-center space-x-2'>
					<img src='/assets/blank-profile-picture.png' className='w-7 h-7 rounded-full'></img>
					<button onClick={logOut} className='btn btn-sm btn-ghost normal-case'>
						Logout
					</button>
				</div>
			)}
			<h1 className='text-3xl font-heading text-center'>
				Hello {session.session.user.user_metadata.user_name}
			</h1>
			<div className={`grid md:grid-cols-2 gap-10 p-3 md:p-8`}>
				<div
					className={`card bg-base-200 shadow-xl transition duration-500 ${
						campaigns.isLoading && 'blur-sm'
					}`}>
					<div className='card-body'>
						<h2 className='card-title font-heading'>Campaigns</h2>
						<ul className='text-lg space-y-2'>
							{campaigns.isLoading && <LoadingSpinner />}
							{campaigns.isSuccess &&
								campaigns.data.map(c => (
									<li
										key={c.campaign_id}
										className='flex items-center justify-between p-2 bg-base-300 rounded-md'>
										<div>{c.name}</div>
										<button
											onClick={() => {
												router.push('/campaign/' + c.campaign_id)
											}}
											className='btn btn-sm'>
											Open
										</button>
									</li>
								))}
						</ul>
						<Dialog open={newCampaignModal}>
							<DialogTrigger asChild>
								<button
									onClick={() => setNewCampaignModal(true)}
									className='btn btn-circle mb-0 mx-auto'>
									+
								</button>
							</DialogTrigger>
							<DialogContent title='Create Campaign' setOpen={setNewCampaignModal}>
								<CreateCampaign close={setNewCampaignModal} />
							</DialogContent>
						</Dialog>
					</div>
				</div>
				<div className='card bg-base-200 shadow-xl'>
					<div className='card-body'>
						<h2 className='card-title font-heading'>Characters</h2>
						<p>coming soon</p>
					</div>
				</div>
				<div className='card bg-base-200 shadow-xl col-span-2'>
					<div className='card-body'>
						<h2 className='card-title font-heading'>Settings</h2>
						<Settings />
					</div>
				</div>
			</div>
		</>
	)
}

interface CreateCampaign {
	close: any
}
function CreateCampaign({ close }: CreateCampaign) {
	useKeydown('Escape', () => close(false))

	const [alert, showAlert] = useState(false)
	const [loading, showLoading] = useState(false)

	const name = useRef<HTMLInputElement>()
	const setting = useRef<HTMLInputElement>()
	const startDate = useRef<HTMLInputElement>()

	const campaigns = useSupabaseQuery(['campaigns'], supabase.from('campaigns').select('*'))

	async function handleClick() {
		if (name.current.value.length > 3 && startDate.current?.value) {
			showAlert(false)
			showLoading(true)
			try {
				const { error } = await supabase.from('campaigns').insert({
					name: name.current.value,
					startdate: startDate.current.valueAsNumber,
					setting: setting.current.value,
				})
				if (error) throw error
				campaigns.mutate()
				toast.success('Campaign created')
				close(false)
			} catch (error) {
				toast.error(error.message)
			}
		} else {
			showAlert(true)
		}
	}
	return (
		<div className='space-y-2'>
			<label className='block'>
				<div>Campaign Name</div>
				<input ref={name} className='input input-primary w-full' />
			</label>
			<label className='block'>
				<div>Campaign Setting</div>
				<textarea ref={setting} className='textarea textarea-primary w-full h-36' />
			</label>
			<label className='block'>
				<div>Ingame Start Date</div>
				<input ref={startDate} type='date' className='input input-primary' />
			</label>
			<button onClick={handleClick} className='btn btn-primary'>
				Create
			</button>
			<span className='inline-block ml-3'>
				<Loading loaded={[!loading]} />
			</span>
			{alert && <span className='text-error ml-2'>please provide a name and date</span>}
		</div>
	)
}
