import { LoadingSpinner } from '@/common/components/loading'
import { BsCheckLg } from 'react-icons/bs'
import { useEffect, useState, useCallback } from 'react'
import debounce from 'lodash.debounce'
import set from 'lodash.set'
import get from 'lodash.get'
import supabase from '@/modules/supabase'
import { useEditor, EditorContent } from '@tiptap/react'
import Document from '@tiptap/extension-document'
import Text from '@tiptap/extension-text'
import Paragraph from '@tiptap/extension-paragraph'
import { useSupabaseQuery } from '@/common/hooks/useSupabaseQuery'
import { useMutation, QueryKey } from 'react-query'
import produce from 'immer'
import { useDebounce } from '@/common/hooks/useDebounce'

interface Autosave {
	queryKey: QueryKey
	query: any
	field: string
	inputClassName?: string
}

export function String({ inputClassName, query, field, queryKey }: Autosave) {
	const [saving, setState] = useState<'saving' | 'saved' | 'error' | null>(null)
	const content = useSupabaseQuery(queryKey, query)
	const value = get(content.data, field)
	const table = query._table
	const column = field.split('.')[0]
	const mutation = useMutation(
		async (value: any) => {
			const { error, data } = await supabase
				.from(table)
				.update({ [column]: value })
				.eq('id', content.data?.id)
			if (error) throw error
			
			return data
		},
		{
			onSuccess: () => setState('saved'),
			onError: () => setState('error'),
		}
	)

	const editor = useEditor({
		content: value || 'Default value',
		extensions: [Document, Paragraph, Text],
		onUpdate() {
			setState('saving')
			debouncer()
		},
		editorProps: {
			attributes: {
				class: 'p-2 focus:outline-none',
			},
		},
	})

	useEffect(() => {
		if (editor) {
			editor.commands.setContent(value)
		}
	}, [value])

	const debouncer = useDebounce(() => {
		if (editor) {
			if (typeof content.data?.[column] === 'object') {
				const newState = produce(content.data?.[column], (draft: any) => {
					set(draft, field, editor.getText())
				})
				mutation.mutate(newState)
			} else {
				mutation.mutate(editor.getText())
			}
		}
	})

	return (
		<div
			className={`relative inline-block transition duration-500 ${content.isLoading && 'blur-sm'}`}>
			<EditorContent
				editor={editor}
				className={'relative hover:bg-accent/30 transition rounded-sm ' + inputClassName}
			/>
			<div className='absolute scale-75 top-1/2 -translate-y-1/2 -right-5'>
				{saving === 'saving' && <LoadingSpinner />}
				{saving === 'saved' && <BsCheckLg className='fill-primary text-base' />}
				{saving === 'error' && <span className='text-error text-sm'>error</span>}
			</div>
		</div>
	)
}
