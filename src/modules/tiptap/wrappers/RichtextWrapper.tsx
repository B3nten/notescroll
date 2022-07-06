import supabase from '../../supabase'
import { Richtext } from '../Richtext'
import { useState } from 'react'
import { useSupabaseQuery } from '@/common/hooks/useSupabaseQuery'
import { JSONContent } from '@tiptap/react'
import { QueryKey, useMutation } from 'react-query'

interface RichtextWrapper {
	queryKey: QueryKey
	query: any
	field: string
	editable?: boolean
	minHeight?: string
	maxHeight?: string
	toolbarVisible?: boolean
}

export function RichtextWrapper({
	queryKey,
	query,
	field,
	editable = true,
	minHeight = '200px',
	maxHeight = 'none',
	toolbarVisible = false,
}: RichtextWrapper) {
	const resource = useSupabaseQuery(queryKey, query)
	const table = query._table
	const [state, setState] = useState<'saving' | 'saved' | 'error' | null>(null)
	const mutation = useMutation(
		async (content: { json: JSONContent; text: string }) => {
			const { error, data } = await supabase
				.from(table)
				.update({ [field]: content.json, [field + '_plaintext']: content.text })
				.eq('id', resource.data?.id)
			if (error) throw error
			return data
		},
		{
			onSuccess: () => setState('saved'),
			onError: () => setState('error'),
		}
	)

	return (
		<div className={`${resource.isLoading ? 'blur-sm' : ''} transition duration-500`}>
			<Richtext
				minHeight={minHeight}
				maxHeight={maxHeight}
				editable={editable}
				state={state}
				onChange={() => setState('saving')}
				onDebouncedChange={content => mutation.mutate(content)}
				content={resource.data?.overview?.content ?? null}
				toolbarVisible={toolbarVisible}
			/>
		</div>
	)
}
