import { Loading, LoadingSpinner } from '@/common/components/loading'
import { BsCheckLg } from 'react-icons/bs'
import { useCallback, useEffect, useRef, useState } from 'react'
//@ts-ignore
import debounce from 'lodash.debounce'
//@ts-ignore
import get from 'lodash.get'
//@ts-ignore
import set from 'lodash.set'
import { useSWRQuery } from '@/modules/supabase/useSWRQuery'
import produce from 'immer'
import supabase from '@/modules/supabase'
import toast from 'react-hot-toast'
import { useEditor, EditorContent, Editor } from '@tiptap/react'
import Document from '@tiptap/extension-document'
import Text from '@tiptap/extension-text'
import Paragraph from '@tiptap/extension-paragraph'
import { useEvent } from '@/common/hooks/useEvent'

interface EditableInput {
	inputClassName?: string
	query: any
	field: string
}

export function EditableDiv({ inputClassName, query, field }: EditableInput) {
	const [saving, setSaving] = useState<'saving' | 'saved' | 'error' | null>(
		null
	)
	const swr = useSWRQuery(query, { revalidateOnMount: false })

	const callback = useEvent(
		debounce(async () => {
			if (editor) {
				const newData = produce(swr.data, (draft: any) => {
					// set the draft's field to the content of input
					set(draft, field, editor.getText())
				})
				//@ts-ignore mutate data
				swr.mutate(newData, false)
				try {
					const { error } = await supabase
						.from(table)
						.update({ [column]: editor.getText() })
						.eq('id', swr.data.id)
					if (error) throw error
					setSaving('saved')
				} catch (error) {
					toast.error('Error: Could not save.')
					setSaving('error')
				}
			}
		}, 500)
	)
	const value = get(swr.data, field)
	const editor = useEditor({
		content: value,
		extensions: [Document, Paragraph, Text],
		onUpdate: handleChange,
		editorProps: {
			attributes: {
				class: 'p-2 focus:outline-none',
			},
		},
	})

	function handleChange({ editor }: any) {
		setSaving('saving')
		callback()
	}

	if (!swr.loaded) return null

	// get the table of the document
	const table = query.url.pathname.substring(
		query.url.pathname.lastIndexOf('/') + 1
	)
	// get the column of the table
	const column = field.split('.')[0]

	return (
		<div className='relative inline-block'>
			<EditorContent
				editor={editor}
				className={
					'relative hover:bg-accent/30 transition rounded-sm ' + inputClassName
				}
			/>
			<div className='absolute scale-75 top-1/2 -translate-y-1/2 -right-5'>
				{saving === 'saving' && <LoadingSpinner />}
				{saving === 'saved' && <BsCheckLg className='fill-primary text-base' />}
				{saving === 'error' && (
					<span className='text-error text-sm'>error</span>
				)}
			</div>
		</div>
	)
}
