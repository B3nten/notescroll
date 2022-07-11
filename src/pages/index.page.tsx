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
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { useMutation, useQueryClient } from 'react-query'
import { queryBuilder } from '@/common/queries/queryBuilder'

export default function Index() {
	const [campaignKey, campaignQuery] = queryBuilder.campaigns.all()
	const campaigns = useSupabaseQuery(campaignKey, campaignQuery)
	const router = useClientRouter()
	const [newCampaignModal, setNewCampaignModal] = useState(false)
	const session = useSession()
	const [animateCampaignList] = useAutoAnimate<any>()

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
				<div className={`card bg-base-200 shadow-xl transition`}>
					<div className='card-body transition'>
						<h2 className='card-title font-heading transition'>Campaigns</h2>
						<ul ref={animateCampaignList} className='text-lg space-y-2 transition'>
							{campaigns.isLoading && <LoadingSpinner />}
							{campaigns.isSuccess &&
								campaigns.data.map(c => (
									<li
										key={c.id}
										className='flex items-center justify-between p-2 bg-base-300 rounded-md'>
										<div>{c.name}</div>
										<button
											onClick={() => {
												router.push('/campaign/' + c.id)
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
									className={`btn btn-circle mb-0 mx-auto transition ${
										campaigns.isLoading && 'opacity-0'
									}`}>
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

	const [campaignKey, campaignQuery] = queryBuilder.campaigns.all()

	const name = useRef<any>()

	const client = useQueryClient()

	const insertCampaign = useMutation(
		async () => {
			if (name.current.value.length > 3) {
				const { data, error } = await supabase
					.from('campaigns')
					.insert({ name: name.current.value })
				if (error) throw error
				return data
			} else {
				throw new Error('Invalid campaign name')
			}
		},
		{
			onError: error => {
				let message = 'An unknown error occured'
				if (error instanceof Error) message = error.message
				toast.error(message)
			},
			onSuccess: data => {
				toast.success('Campaign created')
				client.setQueryData(campaignKey, (oldData: any) => {
					let newData = [...(oldData as {}[])]
					newData.push(data)
					return newData
				})
				close(false)
			},
		}
	)

	return (
		<div className='space-y-2'>
			<label className='block'>
				<div>Campaign Name</div>
				<input ref={name} className='input input-primary w-full' />
			</label>
			<button onClick={() => insertCampaign.mutate()} className='btn btn-primary'>
				<div className='flex space-x-2'>
					<span>Create</span>
					{insertCampaign.isLoading && <LoadingSpinner />}
				</div>
			</button>
		</div>
	)
}
