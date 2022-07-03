import {
	Dropdown,
	DropdownContent,
	DropdownItem,
	DropdownTrigger,
} from '@/common/components/dropdown'
import { useClientRouter } from '@/common/hooks/useClientRouter'
import { queries } from '@/modules/supabase/queries'
import { useSWRQuery } from '@/modules/supabase/useSWRQuery'
import { SWREditorWrapper } from '@/modules/tiptap/wrappers/SWREditorWrapper'
import { Layout } from '../../layout'
import { Menu } from './Menu'
import supabase from '@/modules/supabase'
import { EditableDiv } from '@/common/components/inputs/EditableDiv'

export default function Note() {
	const router = useClientRouter()
	const query = supabase
		.from('documents')
		.select('*')
		.eq('id', router.query.nid)
		.single()
	const note = useSWRQuery(query)

	return (
		<>
			<div className='flex items-center justify-between'>
				<h1 className='font-heading text-4xl'>
					<EditableDiv query={query} field='name' />
				</h1>
				<Menu />
			</div>
			<SWREditorWrapper
				query={query}
				plaintext='overview_plaintext'
				content='overview'
				toolbarVisible
			/>
		</>
	)
}

Note.getLayout = function getLayout(page: React.ReactNode) {
	return <Layout>{page}</Layout>
}
