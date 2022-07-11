import { keyBuilder } from './keyBuilder'
import supabase from '@/modules/supabase'
import { definitions } from '@/types/database'

export const queryBuilder = {
	notes: {
		all() {
			return [
				keyBuilder.notes.all(),
				supabase
					.from<definitions['documents']>('documents')
					.select('name, id, campaign_id, type, updated_at, created_at, tags'),
			] as const
		},
		campaign(cid: string) {
			return [
				keyBuilder.notes.campaign(cid),
				supabase
					.from<definitions['documents']>('documents')
					.select('name, id, campaign_id, type, updated_at, created_at, tags')
					.eq('campaign_id', cid),
			] as const
		},
		single(nid: string) {
			return [
				keyBuilder.notes.single(nid),
				supabase.from<definitions['documents']>('documents').select('*').eq('id', nid).single(),
			] as const
		},
	},
	timelines: {
		all() {
			return [
				keyBuilder.timelines.all(),
				supabase
					.from<definitions['timelines']>('timelines')
					.select('name, id, campaign_id, updated_at, tags'),
			] as const
		},
		campaign(cid: string) {
			return [
				keyBuilder.timelines.campaign(cid),
				supabase
					.from<definitions['timelines']>('timelines')
					.select('name, id, campaign_id, updated_at, tags')
					.eq('campaign_id', cid),
			] as const
		},
		single(tid: string) {
			return [
				keyBuilder.notes.single(tid),
				supabase.from<definitions['timelines']>('timelines').select('*').eq('id', tid).single(),
			] as const
		},
	},
	events: {
		all() {
			return [
				keyBuilder.events.all(),
				supabase
					.from<definitions['events']>('events')
					.select('name, id, campaign_id, updated_at, created_at'),
			] as const
		},
		campaign(cid: string) {
			return [
				keyBuilder.events.campaign(cid),
				supabase
					.from<definitions['events']>('events')
					.select('name, id, campaign_id, updated_at, created_at')
					.eq('campaign_id', cid),
			] as const
		},
		timeline(tid: string) {
			return [
				keyBuilder.events.timeline(tid),
				supabase
					.from<definitions['events']>('events')
					.select('id, index')
					.eq('timeline_id', tid),
			] as const
		},
		single(eid: string) {
			return [
				keyBuilder.events.single(eid),
				supabase.from<definitions['events']>('events').select('*').eq('id', eid).single(),
			] as const
		},
	},
	campaigns: {
		all() {
			return [
				keyBuilder.campaigns.all(),
				supabase
					.from<definitions['campaigns']>('campaigns')
					.select('name, id, updated_at, created_at'),
			] as const
		},
		single(cid: string) {
			return [
				keyBuilder.campaigns.single(cid),
				supabase.from<definitions['campaigns']>('campaigns').select('*').single(),
			] as const
		},
	},
	profiles: {
		single(pid: string) {
			return [
				keyBuilder.profiles.single(pid),
				supabase.from<definitions['profile']>('profile').select('*').single(),
			] as const
		},
	},
}
