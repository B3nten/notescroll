import supabase from '@/modules/supabase'
import { definitions } from '@/types/database'

export const keyBuilder = {
	campaigns: {
		all() {
			return ['campaigns']
		},
		single(cid: string) {
			return [this.all(), cid]
		},
	},
	profiles: {
		all() {
			return ['profiles']
		},
		single(pid: string) {
			return [this.all, pid]
		},
	},
	notes: {
		all() {
			return ['notes']
		},
		campaign(cid: string) {
			return [this.all(), cid]
		},
		single(cid: string, nid: string) {
			return [this.campaign(cid), nid]
		},
	},
}

export const queryBuilder = {
	notes: {
		all() {
			return [
				keyBuilder.notes.all(),
				supabase
					.from<definitions['documents']>('documents')
					.select('name, id, campaign_id, type, updated_at, created_at'),
			] as const
		},
		campaign(cid: string) {
			return [
				keyBuilder.notes.campaign(cid),
				supabase
					.from<definitions['documents']>('documents')
					.select('name, id, campaign_id, type, updated_at, created_at'),
			] as const
		},
		single(cid: string, nid: string) {
			return [
				keyBuilder.notes.single(cid, nid),
				supabase.from<definitions['documents']>('documents').select('*').single(),
			] as const
		},
	},
}
