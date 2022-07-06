import { RichtextWrapper } from '@/modules/tiptap/wrappers/RichtextWrapper'
import supabase from '@/modules/supabase'
import { definitions } from '@/types/database'
import * as Autosave from '@/modules/autosave'
import { useClientRouter } from '@/common/hooks/useClientRouter'
export default function Test() {
	const router = useClientRouter()
	const query = supabase
		.from<definitions['documents']>('documents')
		.select('*')
		.eq('id', 'ec5d2715-6bbe-42c6-92ed-6dffbfe342b7')
		.single()
	return (
		<div className='p-10'>
			<RichtextWrapper queryKey='document' query={query} field='overview' />
			<Autosave.String query={query} field='name' queryKey='document' />
		</div>
	)
}
