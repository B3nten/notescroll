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
		recent(cid: string, limit: number) {
			return [this.campaign(cid), 'recent', limit]
		},
		single(nid: string) {
			return [this.all(), nid]
		},
	},
	timelines: {
		all() {
			return ['timelines']
		},
		campaign(cid: string) {
			return [this.all(), cid]
		},
		single(tid: string) {
			return [this.all(), tid]
		},
	},
	events: {
		all() {
			return ['events']
		},
		campaign(cid: string) {
			return [this.all(), cid]
		},
		timeline(tid: string) {
			return [this.all(), tid]
		},
		single(eid: string) {
			return [this.all(), eid]
		},
	},
}
