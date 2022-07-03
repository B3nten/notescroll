import { LoadingSpinner } from '@/common/components/loading'
import { BsCheckLg } from 'react-icons/bs'
import { useState, useRef } from 'react'
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
import { useEvent } from '@/common/hooks/useEvent'
import * as dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { useSWRConfig } from 'swr'
import { useClientRouter } from '@/common/hooks/useClientRouter'
dayjs.extend(utc)
dayjs.extend(customParseFormat)

interface EditableInput {
	inputClassName?: string
	query: any
	field: string
}

export function EditableDate({ inputClassName, query, field }: EditableInput) {
	const { mutate } = useSWRConfig()
	const router = useClientRouter()
	const [saving, setSaving] = useState<'saving' | 'saved' | 'error' | null>(
		null
	)
	const dateElement = useRef<HTMLInputElement | null>(null)
	const timeElement = useRef<HTMLInputElement | null>(null)
	const swr = useSWRQuery(query, { revalidateOnMount: false })
	const eventlist = useSWRQuery(
		supabase
			.from('events')
			.select('id, date')
			.eq('timeline_id', router.query.tid)
	)

	const callback = useEvent(
		debounce(async (parsedDate: number) => {
			const newData = produce(swr.data, (draft: any) => {
				// set the draft's field to the content of input
				set(draft, field, parsedDate)
			})
			//@ts-ignore mutate data
			swr.mutate(newData, false)
			console.log(parsedDate)
			try {
				const { error } = await supabase
					.from(table)
					.update({ [column]: parsedDate })
					.eq('id', swr.data.id)
				if (error) throw error
				setSaving('saved')
				eventlist.mutate()
			} catch (error) {
				toast.error('Error: Could not save.')
				setSaving('error')
			}
		}, 1500)
	)
	const value = get(swr.data, field)

	function mutateDate() {
		const mergedDate =
			dateElement.current.value + '-' + timeElement.current.value
		const parsedDate = dayjs.utc(mergedDate, 'YYYY-MM-DD-HH-MM').valueOf()
		setSaving('saving')
		callback(parsedDate)
	}

	if (!swr.loaded) return null

	// get the table of the document
	const table = query.url.pathname.substring(
		query.url.pathname.lastIndexOf('/') + 1
	)
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
					onChange={mutateDate}
				/>
				<input
					defaultValue={time}
					ref={timeElement}
					className='bg-transparent'
					type='time'
					onChange={mutateDate}
				/>
			</div>
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
