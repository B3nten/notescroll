import { LoadingSpinner } from '@/common/components/loading'
import { pluralizeType } from '@/common/functions/pluralizeType'
import { notesKeyBuilder } from '@/common/hooks/queries/notes'
import { useClientRouter } from '@/common/hooks/useClientRouter'
import { useSupabaseQuery } from '@/common/hooks/useSupabaseQuery'
import supabase from '@/modules/supabase'
import Link from 'next/link'
import { useQueryClient, QueryKey, useMutation } from 'react-query'
import { AddNote } from './AddNote'
import { queryBuilder } from '@/common/queries/queryBuilder'
import { TagViewer } from '../tags'
import { useState } from 'react'
import { useAutoAnimate } from '@formkit/auto-animate/react'

export function NoteList() {
	const router = useClientRouter()
	const queryClient = useQueryClient()
	const type = router.query.type
	const [queryKey, queryFn] = queryBuilder.notes.campaign(router.query.cid as string)
	const list = useSupabaseQuery(queryKey, queryFn)
	const [animateRef] = useAutoAnimate()

	function getRouterTagsAsArray(): string[] {
		let routerTags: string[] = []
		if (router.query.tags && router.query.tags.length > 0) {
			if (Array.isArray(router.query.tags)) {
				routerTags = router.query.tags
			} else {
				routerTags = [router.query.tags]
			}
		}
		return routerTags
	}

	function sortFilterList() {
		if (!list.data) return list.data

		let newList = list.data

		if (router.query.sort === 'type') {
			newList.sort((a, b) => a.type.localeCompare(b.type))
		} else if (router.query.sort === 'name') {
			newList.sort((a, b) => a.name.localeCompare(b.name))
		} else {
			newList.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
		}

		if (router.query.type) {
			newList = newList.filter(item => item.type === router.query.type)
		}

		if (router.query.tags && router.query.tags.length > 0) {
			newList = newList.filter(item =>
				getRouterTagsAsArray().every(tag => item.tags?.includes(tag as string))
			)
		}

		return newList
	}

	function getAllDocumentTags() {
		const set = new Set<string>()
		list.data?.forEach(item => item.tags?.forEach(t => set.add(t)))
		return Array.from(set)
	}

	const tagMutation = useMutation(
		async ({ nid, tags }: { nid: string; tags: string[] }) => {
			const { data, error } = await supabase
				.from('documents')
				.update({ tags: tags })
				.eq('id', nid)
			if (error) throw error
			return data
		},
		{
			onSuccess: () => {
				list.refetch()
			},
		}
	)

	const [tagFilter, setTagFilter] = useState<string[]>([])

	function addTagToFilter(tag: string) {
		const newTagFilter = new Set(tagFilter)
		newTagFilter.add(tag)
		setTagFilter(Array.from(newTagFilter))
		router.replace({ query: { ...router.query, tags: Array.from(newTagFilter) } })
	}
	function removeTagFromFilter(tag: string) {
		const newTagFilter = new Set(tagFilter)
		newTagFilter.delete(tag)
		setTagFilter(Array.from(newTagFilter))
		router.replace({ query: { ...router.query, tags: Array.from(newTagFilter) } })
	}

	return (
		<div className='card bg-base-200'>
			<div className='card-body'>
				<div className='flex justify-between'>
					<div className='flex justify-center items-center space-x-4'>
						<h2 className='card-title font-heading'>
							<span className='capitalize'>{pluralizeType(type as string) ?? 'Notes'}</span>
						</h2>
						<TagViewer
							tags={getAllDocumentTags()}
							onTagClick={t => addTagToFilter(t)}
							display
						/>
						<div className='space-x-1 space-y-1'>
							{tagFilter &&
								tagFilter.map((tag: string, i: number) => (
									<button
										key={i + tag}
										onClick={() => removeTagFromFilter(tag)}
										className='bg-primary px-1 rounded-md text-primary-content'>
										{tag}{' '}
									</button>
								))}
						</div>
					</div>
					<AddNote />
				</div>
				<ul className='space-y-1' ref={animateRef}>
					{list.isLoading && <LoadingSpinner />}
					{list.isSuccess &&
						sortFilterList()?.map((item: any) => (
							<li
								key={item.id}
								className='flex justify-between items-center p-2 bg-base-300 rounded-md text-lg'>
								<div className='flex items-center justify-center space-x-4'>
									<span>{item.name}</span>
									<TagViewer
										tags={item.tags}
										showTags
										onTagAdd={tags => tagMutation.mutate({ nid: item.id, tags: tags })}
										onTagRemove={tags => tagMutation.mutate({ nid: item.id, tags: tags })}
									/>
								</div>
								<Link href={`/campaign/${router.query.cid}/notes/${item.id}`}>
									<button
										onMouseEnter={async () => {
											await queryClient.prefetchQuery(
												notesKeyBuilder.single(item.id),
												async () => {
													const { data, error } = await supabase
														.from('documents')
														.select('*')
														.eq('id', item.id)
														.single()
													if (error) throw error
													return data
												}
											)
										}}
										className='btn btn-sm'>
										open
									</button>
								</Link>
							</li>
						))}
				</ul>
			</div>
		</div>
	)
}
