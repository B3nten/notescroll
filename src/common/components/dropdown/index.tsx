import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'
import styles from './dropdown.module.css'
import React from 'react'

export const DropdownContent = React.forwardRef<any>(
    ({ children, ...props }, forwardedRef) => {
        return (
            <DropdownMenuPrimitive.Content ref={forwardedRef} className={styles.content + ' p1 bg-primary shadow-xl rounded-lg origin-top '}>
                <div className='space-y-1 flex flex-col p-1'>{children}</div>
                <DropdownMenuPrimitive.Arrow className='fill-primary' />
            </DropdownMenuPrimitive.Content>
        )
    }
)
export const Dropdown = DropdownMenuPrimitive.Root
export const DropdownTrigger = DropdownMenuPrimitive.Trigger
export const DropdownItem = DropdownMenuPrimitive.Item