import type { SpotlightAction } from '@mantine/spotlight'
import Router from 'next/router'
import { logOut } from '../supabase'

const actions: SpotlightAction[] = [
	{
		title: 'Dashboard',
		description: 'Go to dashboard.',
		onTrigger: () => Router.push(`/`),
	},
	{
		title: 'Log out',
		description: 'Log out',
		onTrigger: () => logOut(),
	},
]

export { actions }
