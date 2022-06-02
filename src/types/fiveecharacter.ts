type skill = {
	value: number
	proficency: boolean
}

export interface fiveecharacter {
	name: string
	class: string
	level: number
	race: string
	alignment: string
	background: string
	xp: number

	inspiration: boolean
	proficencybonus: number
	passiveperception: number

	initiative: number
	ac: number
	speed: number

	hp: number
	maxhp: number
	temphp: number
	hitdie: string

	deathsaves: {
		successes: number
		fails: number
	}

	stats: {
		str: number
		dex: number
		con: number
		int: number
		wis: number
		cha: number
	}

	saves: {
		str: skill
		dex: skill
		con: skill
		int: skill
		wis: skill
		cha: skill
	}

	skills: {
		acrobatics: skill
		animalhandeling: skill
		arcana: skill
		athletics: skill
		deception: skill
		history: skill
		insight: skill
		intimidation: skill
		investigation: skill
		medicine: skill
		nature: skill
		perception: skill
		performance: skill
		persuasion: skill
		religion: skill
		slightofhand: skill
		stealth: skill
		survival: skill
	}

	personality: string
	ideals: string
	bonds: string
	flaws: string

    attacks: {
        name: string
        attack: string
        damage: string
    }[]

    equiptment: {
        name: string
        weight: string
    }[]
    
    feats: {
        name: string
        description: string
    }[]

    languages: string[]
}
