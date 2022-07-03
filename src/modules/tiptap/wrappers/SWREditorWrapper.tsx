import supabase from '../../supabase'
import { useSWRQuery } from '../../supabase/useSWRQuery'
import { Editor } from '../Editor'
import { useEffect, useState, useRef } from 'react'
import { useEvent } from '@/common/hooks/useEvent'
import toast from 'react-hot-toast'

interface Wrapper {
	query: any
	content: string
	plaintext: string
	editable?: boolean
	minHeight?: string
	maxHeight?: string
	toolbarVisible?: boolean
}

export function SWREditorWrapper({
	query,
	content,
	plaintext,
	editable,
	minHeight = '200px',
	maxHeight = 'none',
	toolbarVisible = false,
}: Wrapper) {
	const table = query.url.pathname.substring(
		query.url.pathname.lastIndexOf('/') + 1
	)
	const { data: queryData, mutate, loaded }: any = useSWRQuery(query)
	const [saveState, setSaveState] = useState<
		'saving' | 'saved' | 'error' | null
	>(null)

	const handleChange = useEvent(async (editorContent: void) => {
		const newState = {
			...queryData,
			[content]: editorContent.json,
			[plaintext]: editorContent.text,
		}
		mutate(newState, false)
		try {
			const { error } = await supabase
				.from(table)
				.update({
					[content]: editorContent.json,
					[plaintext]: editorContent.text,
				})
				.eq('id', queryData.id)
			if (error) throw error
			setSaveState('saved')
		} catch (error) {
			console.log(error)
			toast.error('Error: Document not saved.')
			setSaveState('error')
		}
	})

	return (
		<Editor
			minHeight={minHeight}
			maxHeight={maxHeight}
			editable={editable}
			contentLoaded={loaded}
			saveState={saveState}
			onUpdate={() => setSaveState('saving')}
			onDebouncedUpdate={(content) => handleChange(content)}
			content={queryData ? queryData[content] : null}
			toolbarVisible={toolbarVisible}
		/>
	)
}
