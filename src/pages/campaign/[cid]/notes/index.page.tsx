import { LoadingSpinner } from '@/common/components/loading'
import { pluralizeType } from '@/common/functions/pluralizeType'
import { notesKeyBuilder, useNoteList } from '@/common/hooks/queries/notes'
import { useClientRouter } from '@/common/hooks/useClientRouter'
import supabase from '@/modules/supabase'
import Link from 'next/link'
import { useQueryClient } from 'react-query'
import { Layout } from '../layout'
import { AddNote } from '../../../../modules/ui/NoteList/AddNote'
import { NoteList } from '@/modules/ui/NoteList'
import { queryBuilder } from '@/common/queries/queryBuilder'

export default function Notes() {
	const router = useClientRouter()
	const [queryKey, queryFn] = queryBuilder.notes.campaign(router.query.cid as string)
	return <NoteList queryFn={queryFn} queryKey={queryKey} />
}

Notes.getLayout = function getLayout(page: React.ReactNode) {
	return <Layout>{page}</Layout>
}
