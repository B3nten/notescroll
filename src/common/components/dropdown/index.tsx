import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import styles from './dropdown.module.css'

interface Props {
    trigger: React.ReactNode,
    children: React.ReactNode,
}

export function Dropdown({ trigger, children }: Props) {
    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
                {trigger}
            </DropdownMenu.Trigger>
            <DropdownMenu.Content
                sideOffset={-10}
                className={styles.content + ' p-4 bg-[#e7dccc] shadow-xl rounded-lg origin-top'}>
                <DropdownMenu.Arrow className='fill-[#e7dccc]' />
                <div className='space-y-1'>{children}</div>
            </DropdownMenu.Content>
        </DropdownMenu.Root>
    )
}