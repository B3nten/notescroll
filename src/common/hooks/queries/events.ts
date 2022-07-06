import supabase from '@/modules/supabase'
import { definitions } from '@/types/database'
import { useQueryClient } from 'react-query'
import { useSupabaseQuery } from '../useSupabaseQuery'

export const eventsKeyBuilder = {
	all: () => ['events'] as const,
	campaign: (campaign_id: string) => [eventsKeyBuilder.all(), 'campaign', campaign_id] as const,
	timeline: (timeline_id: string) => [eventsKeyBuilder.all(), 'timeline', timeline_id] as const,
	list: (timeline_id: string, filter?: any) =>
		[eventsKeyBuilder.timeline(timeline_id), 'list', filter ?? null] as const,
	single: (id: string) => [eventsKeyBuilder.all(), id] as const,
}

export function useEventList(timeline_id: string) {
	const client = useQueryClient()
	const invalidate = () => client.invalidateQueries(eventsKeyBuilder.list(timeline_id))
	const query = useSupabaseQuery(
		eventsKeyBuilder.list(timeline_id),
		supabase.from<definitions['events']>('events').select('id').eq('timeline_id', timeline_id)
	)
	return { ...query, invalidate }
}
export function useSingleEvent(id: string) {
	const client = useQueryClient()
	const invalidate = () => client.invalidateQueries(eventsKeyBuilder.single(id))
	const query = useSupabaseQuery(
		eventsKeyBuilder.single(id),
		supabase.from<definitions['events']>('events').select('*').eq('id', id)
	)
	return { ...query, invalidate }
}
