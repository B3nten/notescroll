import { useQueryClient } from 'react-query'
import supabase, { useSession } from '../supabase'
import { useTheme } from '../theme'

const themeList = [
	'light',
	'dark',
	'cupcake',
	'bumblebee',
	'emerald',
	'corporate',
	'synthwave',
	'retro',
	'cyberpunk',
	'valentine',
	'halloween',
	'garden',
	'forest',
	'aqua',
	'lofi',
	'pastel',
	'fantasy',
	'wireframe',
	'black',
	'luxury',
	'dracula',
	'cmyk',
	'autumn',
	'business',
	'acid',
	'lemonade',
	'night',
	'coffee',
	'winter',
]

export default function Settings() {
	const session = useSession()
	const client = useQueryClient()
	async function setThemeName(name: string) {
		const { data, error } = await supabase
			.from('profile')
			.update({ theme: name })
			.eq('id', session.session.user.id)
		client.invalidateQueries(['profile'])
	}

	return (
		<div className='space-x-2 space-y-2'>
			<h2 className='text-xl mt-5'>Theme</h2>
			{themeList.map(name => (
				<ThemeButton key={name} name={name} onClick={() => setThemeName(name)} />
			))}
		</div>
	)
}

function ThemeButton({ name, onClick }: any) {
	return (
		<button data-theme={name} onClick={onClick} className='btn btn-sm border-2 border-secondary'>
			<h3 className=''>{name}</h3>
		</button>
	)
}
