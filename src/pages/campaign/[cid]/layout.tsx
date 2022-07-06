import Link from 'next/link'
import styles from './campaign.module.css'
import {
	GiMagicAxe,
	GiMagicPortal,
	GiDreamCatcher,
	GiCircleClaws,
	GiSettingsKnobs,
	GiVillage,
	GiDwarfFace,
	GiNotebook,
	GiHouse,
	GiClockwork,
	Gi3DMeeple,
} from 'react-icons/gi'
import supabase, { useSession } from '@/modules/supabase'
import { logOut } from '@/modules/supabase'
import { useClientRouter } from '@/common/hooks/useClientRouter'
import { cloneElement, useEffect } from 'react'
import { Loading, LoadingSpinner } from '@/common/components/loading'
import { useSpotlight } from '@mantine/spotlight'
import { useSupabaseQuery } from '@/common/hooks/useSupabaseQuery'
import { definitions } from '@/types/database'
import { useQueryClient } from 'react-query'
import { notesKeyBuilder } from '@/common/hooks/queries/notes'
import { timelinesKeyBuilder } from '@/common/hooks/queries/timelines'

export function Layout(props: any) {
	const router = useClientRouter()
	const queryClient = useQueryClient()
	useEffect(() => {
		async function preload() {
			await queryClient.prefetchQuery(
				notesKeyBuilder.list(router.query.cid as string),
				async () => {
					const { data, error } = await supabase.from('documents').select('name, id, type')
					if (error) throw error
					return data
				}
			)
		}
		preload()
	}, [])
	useEffect(() => {
		async function preload() {
			await queryClient.prefetchQuery(
				timelinesKeyBuilder.list(router.query.cid as string),
				async () => {
					const { data, error } = await supabase.from('timelines').select('name, id')
					if (error) throw error
					return data
				}
			)
		}
		preload()
	}, [])
	const campaign = useSupabaseQuery(
		['campaign', router.query.cid],
		supabase
			.from<definitions['campaigns']>('campaigns')
			.select('*')
			.eq('campaign_id', router.query.cid as string)
	)
	const session = useSession()
	const spotlight = useSpotlight()
	useEffect(() => {
		spotlight.registerActions([
			{
				title: 'Notes',
				id: 'notes',
				description: 'Go to your notes.',
				onTrigger: () => router.push(`/campaigns/${router.query.cid}/notes`),
			},
			{
				title: 'Timelines',
				id: 'timelines',
				description: 'Go to your timelines.',
				onTrigger: () => router.push(`/campaign/${router.query.cid}/timelines`),
			},
			{
				title: 'Characters',
				id: 'characters',
				description: 'View character notes',
				onTrigger: () => router.push(`/campaign/${router.query.cid}/notes?type=character`),
			},
			{
				title: 'Locations',
				id: 'locations',
				description: 'View location notes',
				onTrigger: () => router.push(`/campaign/${router.query.cid}/notes?type=location`),
			},
			{
				title: 'Items',
				id: 'items',
				description: 'View item notes',
				onTrigger: () => router.push(`/campaign/${router.query.cid}/notes?type=item`),
			},
			{
				title: 'Lore',
				id: 'lore',
				description: 'View lore notes',
				onTrigger: () => router.push(`/campaign/${router.query.cid}/notes?type=lore`),
			},
			{
				title: 'Dreams',
				id: 'dreams',
				description: 'View dream notes',
				onTrigger: () => router.push(`/campaign/${router.query.cid}/notes?type=dream`),
			},
			{
				title: 'other',
				id: 'other',
				description: 'View other notes',
				onTrigger: () => router.push(`/campaign/${router.query.cid}/notes?type=other`),
			},
		])
		console.log('actions registered')
		return () => {
			spotlight.removeActions(['characters', 'locations', 'items', 'lore', 'dreams', 'other'])
			console.log('actions removed')
		}
	}, [])

	if (campaign.isLoading)
		return (
			<div className='absolute inset-0 flex jusify-center items-center'>
				<LoadingSpinner />
			</div>
		)
	if (campaign.data)
		return (
			<div
				className={styles.wrapper}
				style={{ minHeight: document.getElementById('container')?.clientHeight }}>
				<nav className='bg-base-200 row-span-2 p-1 lg:p-2'>
					<div className='mt-10'>
						<NavComponent name='Home' icon={<GiHouse />} href={'/campaign/[cid]'} />
						<NavComponent
							name='Timelines'
							icon={<GiClockwork />}
							href={'/campaign/[cid]/timelines'}
						/>
						<NavComponent name='Notes' icon={<GiNotebook />} href={'/campaign/[cid]/notes'} />
						<Seperator />
						<NavComponent
							name='Characters'
							icon={<GiDwarfFace />}
							href={'/campaign/[cid]/notes?type=character'}
						/>
						<NavComponent
							name='Locations'
							icon={<GiVillage />}
							href={'/campaign/[cid]/notes?type=location'}
						/>
						<NavComponent
							name='Items'
							icon={<GiMagicAxe />}
							href={'/campaign/[cid]/notes?type=item'}
						/>
						<NavComponent
							name='Lore'
							icon={<GiMagicPortal />}
							href={'/campaign/[cid]/notes?type=lore'}
						/>
						<NavComponent
							name='Dreams'
							icon={<GiDreamCatcher />}
							href={'/campaign/[cid]/notes?type=dream'}
						/>
						<NavComponent
							name='Other'
							icon={<GiCircleClaws />}
							href={'/campaign/[cid]/notes?type=other'}
						/>
						<Seperator />
						<NavComponent name='Dashboard' icon={<Gi3DMeeple />} href={'/'} />
						<NavComponent
							name='Settings'
							icon={<GiSettingsKnobs />}
							href={'/campaign/[cid]/settings'}
						/>
					</div>
				</nav>
				{session.session && (
					<div className='relative p-4 w-full mb-8 flex justify-end items-center space-x-2'>
						<img src='/assets/blank-profile-picture.png' className='w-7 h-7 rounded-full'></img>
						<button onClick={logOut} className='btn btn-sm btn-ghost normal-case'>
							Logout
						</button>
					</div>
				)}
				<div className='p-4'>{props.children}</div>
			</div>
		)
	else return <div>cannot find campaign</div>
}

function NavComponent({ name, href, hover, icon, onHover }: any) {
	const router = useClientRouter()
	const url = href.replace('[cid]', router.query.cid)
	return (
		<Link href={url}>
			<a
				onMouseEnter={onHover}
				className='py-2 px-2 lg:py-4 lg:px-8 flex items-end space-x-2 hover:bg-base-300 transition rounded-md'>
				{cloneElement(icon, {
					className: `w-8 h-8 ${url === router.asPath && 'fill-primary stroke-primary'}`,
				})}
				<div className='hidden lg:block text-2xl leading-none'>{name}</div>
			</a>
		</Link>
	)
}

function Seperator() {
	return <div className='h-[1px] bg-base-content/30 my-3'></div>
}
