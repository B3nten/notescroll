import supabase from '@/modules/supabase'
import { definitions } from '@/types/database'
import { useQueryClient } from 'react-query'
import { useSupabaseQuery } from '../useSupabaseQuery'

export const notesKeyBuilder = {
	all: () => ['notes'] as const,
	campaign: (campaign_id: string) => [notesKeyBuilder.all(), 'campaign', campaign_id] as const,
	list: (campaign_id: string, filter?: any) =>
		[notesKeyBuilder.campaign(campaign_id), 'list', filter ?? null] as const,
	single: (id: string) => [notesKeyBuilder.all(), id] as const,
}

export function useNoteList(campaign_id: string) {
	const client = useQueryClient()
	const invalidate = () => client.invalidateQueries(notesKeyBuilder.list(campaign_id))
	const query = useSupabaseQuery(
		notesKeyBuilder.list(campaign_id),
		supabase
			.from<definitions['documents']>('documents')
			.select('name, type, id, created_at, updated_at')
			.eq('campaign_id', campaign_id)
	)
	return { ...query, invalidate }
}
export function useSingleNote(id: string) {
	const client = useQueryClient()
	const invalidate = () => client.invalidateQueries(notesKeyBuilder.single(id))
	const query = useSupabaseQuery(
		notesKeyBuilder.single(id),
		supabase.from<definitions['documents']>('documents').select('*').eq('id', id)
	)
	return { ...query, invalidate }
}
