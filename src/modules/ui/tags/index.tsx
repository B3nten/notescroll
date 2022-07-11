import { AiFillTag } from 'react-icons/ai'
import { Popover, PopoverTrigger, PopoverContent } from '@/common/components/popover'
import { useRef, useState, useEffect } from 'react'

export function TagViewer({
	showTags = false,
	tags,
	display = false,
	onTagClick,
	onTagAdd,
	onTagRemove,
}: {
	showTags?: boolean
	tags: string[] | null | undefined
	display?: boolean
	onTagClick?: (tag: string) => any
	onTagAdd?: (tags: string[]) => any
	onTagRemove?: (tags: string[]) => any
}) {
	const [tagStore, setTagStore] = useState(tags)

	useEffect(() => {
		setTagStore(tags)
	}, [tags])

	const ref = useRef<any>()

	function addTag(tag: string) {
		if (tagStore) {
			const newTagStore = [...tagStore, tag]
			setTagStore(newTagStore)
			if (onTagAdd) {
				onTagAdd(newTagStore)
			}
		} else {
			setTagStore([tag])
			if (onTagAdd) {
				onTagAdd([tag])
			}
		}
	}

	function removeTag(tag: string) {
		if (tagStore) {
			const newTagStore = tagStore.filter(t => t != tag)
			setTagStore(newTagStore)
			if (onTagRemove) {
				onTagRemove(newTagStore)
			}
		}
	}

	function tagClick(tag: string) {
		if (onTagClick) {
			onTagClick(tag)
		}
	}

	return (
		<Popover>
			<PopoverTrigger asChild>
				<button className='flex items-center justify-center'>
					<AiFillTag className='text-xl inline-block' />
					{showTags && (
						<span className='inline-block p-1 space-x-1 max-w-[200px] overflow-clip'>
							{tagStore
								?.filter((e, i) => i < 3)
								.map((t, i) => (
									<span
										className='bg-primary px-1 rounded-md text-xs text-primary-content'
										key={t + i}>
										{t}
									</span>
								))}
						</span>
					)}
				</button>
			</PopoverTrigger>
			<PopoverContent>
				<div className='min-w-[200px] min-h-[100px] max-w-[300px] card card-content bg-secondary-focus rounded-md p-1'>
					<div className='space-x-1 space-y-1'>
						{tagStore &&
							tagStore.map((tag: string, i: number) => (
								<button
									key={i + tag}
									onClick={() => tagClick(tag)}
									className='bg-primary px-1 rounded-md'>
									{tag}{' '}
									{!display && (
										<button
											onClick={e => {
												e.preventDefault()
												removeTag(tag)
											}}
											className='inline-block font-mono bg-accent rounded-full w-4 h-4 text-sm leading-none'>
											x
										</button>
									)}
								</button>
							))}
					</div>
				</div>
				{!display && (
					<div className='flex items-center space-x-2 mt-2'>
						<input ref={ref} className='input input-sm text-base-content'></input>
						<button
							onClick={() => addTag(ref.current?.value ?? 'nothing')}
							className='btn btn-primary btn-xs btn-circle '>
							+
						</button>
					</div>
				)}
			</PopoverContent>
		</Popover>
	)
}
