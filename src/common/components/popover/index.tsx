import * as PopoverPrimitive from '@radix-ui/react-popover'
import React from 'react'
import styles from './popover.module.css'

export const PopoverContent = React.forwardRef(
	({ children, ...props }: { children: React.ReactNode; props?: any }, forwardedRef) => (
		<PopoverPrimitive.Content
			className={
				styles.content +
				' p-2 bg-secondary text-secondary-content shadow-xl rounded-lg origin-top'
			}
			sideOffset={5}
			{...props}
			ref={forwardedRef}>
			{children}
			<PopoverPrimitive.Arrow className='fill-secondary' />
		</PopoverPrimitive.Content>
	)
)

export const Popover = PopoverPrimitive.Root
export const PopoverTrigger = PopoverPrimitive.Trigger
