import supabase from '.'

export const queries = {
	campaignList: {
		query: () => supabase.from('campaigns').select('*'),
	},

	campaign: {
		query: (cid: string): any =>
			supabase.from('campaigns').select('*').eq('campaign_id', cid).single(),
	},

	noteList: {
		query: (cid: string): any =>
			supabase
				.from('documents')
				.select('name, type, id')
				.eq('campaign_id', cid)
				.order('updated_at', { ascending: false }),
	},

	timelineList: {
		query: (cid: string): any =>
			supabase
				.from('timelines')
				.select('name, startdate, id')
				.eq('campaign_id', cid)
				.order('updated_at', { ascending: false }),
	},

	allRecentDocuments: {
		query: (num: number) => supabase.from('documents').select('*').limit(num),
	},

	note: {
		query: (id: string) =>
			supabase.from('documents').select('*').eq('id', id).single(),
	},

	timeline: {
		query: (id: string) =>
			supabase.from('timelines').select('*').eq('id', id).single(),
	},
	eventList: {
		query: (tid: string) =>
			supabase.from('events').select('*').eq('timeline_id', tid),
	},
	event: {
		query: (eid: string) =>
			supabase.from('events').select('*').eq('id', eid).single(),
	},
}
