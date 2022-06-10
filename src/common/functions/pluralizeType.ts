export function pluralizeType(str: string) {
	switch (str) {
		case 'character':
			return 'characters'
		case 'item':
			return 'items'
		case 'location':
			return 'locations'
		case 'lore':
			return 'lore'
		case 'dream':
			return 'dreams'
		case 'other':
			return 'other'
		default:
			return null
	}
}
