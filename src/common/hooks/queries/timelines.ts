import supabase from '@/modules/supabase'
import { definitions } from '@/types/database'
import { useQueryClient } from 'react-query'
import { useSupabaseQuery } from '../useSupabaseQuery'

export const timelinesKeyBuilder = {
	all: () => ['timelines'] as const,
	campaign: (campaign_id: string) => [timelinesKeyBuilder.all(), 'campaign', campaign_id] as const,
	list: (campaign_id: string, filter?: any) =>
		[timelinesKeyBuilder.campaign(campaign_id), 'list', filter ?? null] as const,
	single: (id: string) => [timelinesKeyBuilder.all(), id] as const,
}

export function useTimelineList(campaign_id: string) {
	const client = useQueryClient()
	const invalidate = () => client.invalidateQueries(timelinesKeyBuilder.list(campaign_id))
	const query = useSupabaseQuery(
		timelinesKeyBuilder.list(campaign_id),
		supabase
			.from<definitions['timelines']>('timelines')
			.select('name, id')
			.eq('campaign_id', campaign_id)
	)
	return { ...query, invalidate }
}
export function useSingleTimeline(id: string) {
	const client = useQueryClient()
	const invalidate = () => client.invalidateQueries(timelinesKeyBuilder.single(id))
	const query = useSupabaseQuery(
		timelinesKeyBuilder.single(id),
		supabase.from<definitions['timelines']>('timelines').select('*').eq('id', id)
	)
	return { ...query, invalidate }
}
