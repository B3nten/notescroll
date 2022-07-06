import { LoadingSpinner } from '@/common/components/loading'
import { BsCheckLg } from 'react-icons/bs'
import { useState, useRef } from 'react'
import get from 'lodash.get'
import supabase from '@/modules/supabase'
import toast from 'react-hot-toast'
import * as dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { useClientRouter } from '@/common/hooks/useClientRouter'
import { useSupabaseQuery } from '@/common/hooks/useSupabaseQuery'
import { useDebounce } from '@/common/hooks/useDebounce'
import { useQueryClient } from 'react-query'
dayjs.extend(utc)
dayjs.extend(customParseFormat)

interface EditableInput {
	inputClassName?: string
	query: any
	field: string
	eventID: string
}

export function EditableDate({ query, field, eventID }: EditableInput) {
	const router = useClientRouter()

	const [saving, setSaving] = useState<'saving' | 'saved' | 'error' | null>(null)

	const dateElement = useRef<HTMLInputElement | null>(null)
	const timeElement = useRef<HTMLInputElement | null>(null)

	const swr = useSupabaseQuery(['event', eventID], query)
	const queryClient = useQueryClient()

	const callback = useDebounce(async () => {
		const mergedDate = dateElement.current.value + '-' + timeElement.current.value
		const parsedDate = dayjs.utc(mergedDate, 'YYYY-MM-DD-HH-MM').valueOf()
		setSaving('saving')
		try {
			const { error } = await supabase
				.from(table)
				.update({ [column]: parsedDate })
				.eq('id', eventID)
			if (error) throw error
			setSaving('saved')
			queryClient.invalidateQueries(['event'])
			queryClient.invalidateQueries(['events'])
		} catch (error) {
			toast.error('Error: Could not save.')
			setSaving('error')
		}
	}, 1500)

	const value = get(swr.data, field)

	if (swr.isLoading) return null

	// get the table of the document
	const table = query.url.pathname.substring(query.url.pathname.lastIndexOf('/') + 1)
	// get the column of the table
	const column = field.split('.')[0]

	const time = dayjs.utc(value).format('hh:ss')
	const date = dayjs.utc(value).format('YYYY-MM-DD')

	return (
		<div className='relative inline-block'>
			<div className='space-x-1 hover:bg-accent/30 transition rounded-sm p-1'>
				<input
					defaultValue={date}
					ref={dateElement}
					className='bg-transparent'
					type='date'
					onChange={callback}
				/>
				<input
					defaultValue={time}
					ref={timeElement}
					className='bg-transparent'
					type='time'
					onChange={callback}
				/>
			</div>
			<div className='absolute scale-75 top-1/2 -translate-y-1/2 -right-5'>
				{saving === 'saving' && <LoadingSpinner />}
				{saving === 'saved' && <BsCheckLg className='fill-primary text-base' />}
				{saving === 'error' && <span className='text-error text-sm'>error</span>}
			</div>
		</div>
	)
}
