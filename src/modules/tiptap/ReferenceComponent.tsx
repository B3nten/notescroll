import { NodeViewWrapper } from '@tiptap/react'
import * as Popover from '@radix-ui/react-popover'
import styles from './referenceComponent.module.css'


export function ReferenceComponent(props: any) {

    console.log(props)
    return (
        <NodeViewWrapper contentEditable={false} as='span' className='reference'>
            <Popover.Root>
                <Popover.Trigger>{props.node.attrs.content}</Popover.Trigger>
                <Popover.Content sideOffset={10} className={styles.content + ' p-2 rounded-lg origin-top bg-[#e7dccc]'}>
                    <h2 className='text-xl font-fancy'>
                        {props.node.attrs.name}
                        <span className='text-base font-handwriting'>{' ('}{props.node.attrs.type}{')'}</span>
                    </h2>
                    <div className='mt-5'>loading...</div>
                </Popover.Content>
            </Popover.Root>
        </NodeViewWrapper>
    )
}