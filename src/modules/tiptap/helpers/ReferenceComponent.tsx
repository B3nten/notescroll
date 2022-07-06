import { NodeViewWrapper } from '@tiptap/react'
import * as Popover from '@radix-ui/react-popover'
import styles from './referenceComponent.module.css'
import { useClientRouter } from '@/common/hooks/useClientRouter'
import { useSingleNote } from '@/common/hooks/queries/notes'

export function ReferenceComponent(props: any) {
	const document = useSingleNote(props.node.attrs.id)
	const router = useClientRouter()

	return (
		<NodeViewWrapper contentEditable={false} as='span' className='reference'>
			<Popover.Root>
				<Popover.Trigger>{props.node.attrs.content}</Popover.Trigger>
				<Popover.Content
					sideOffset={10}
					className={
						styles.content + ' p-2 rounded-lg origin-top bg-primary text-primary-content shadow-lg'
					}>
					<h2 className='text-xl'>
						{document?.data?.name ? document.data.name : props.node.attrs.name}
						<span className='text-base font-handwriting'>
							{' ('}
							{props.node.attrs.type}
							{')'}
						</span>
					</h2>
					{!document.isLoading && (
						<div className='mt-2 text-sm max-w-[200px] sm:max-w-sm md:max-w-lg max-h-[200px] overflow-y-auto min-h-[3rem]'>
							{document?.data?.overview_plaintext}
						</div>
					)}
					<button
						onClick={() => router.push(`/campaign/${router.query.cid}/notes/${document.data?.id}`)}
						className='btn btn-secondary btn-xs mt-2'>
						Goto document
					</button>
				</Popover.Content>
			</Popover.Root>
		</NodeViewWrapper>
	)
}
