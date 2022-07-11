import * as DialogPrimitive from '@radix-ui/react-dialog'
import styles from './dialog.module.css'

interface Props {
	children?: React.ReactNode
	title?: string | React.ReactNode
	setOpen?: (state: boolean) => void
}

export function DialogContent({ children, title = '', setOpen = () => {} }: Props) {
	return (
		<DialogPrimitive.Portal>
			<DialogPrimitive.Overlay
				asChild
				className={styles.dialogoverlay}
				onClick={() => setOpen(false)}>
				<div
					className={
						styles.dialogoverlay +
						' ' +
						'fixed inset-0 bg-base-100/20 backdrop-blur-[3px] transition'
					}></div>
			</DialogPrimitive.Overlay>
			<DialogPrimitive.Content className={styles.dialogcontent}>
				<div className='fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 modal-box w-full'>
					<div className='flex w-full justify-between items-end'>
						<DialogPrimitive.Title className='text-2xl mr-10'>{title}</DialogPrimitive.Title>
						<DialogPrimitive.Close asChild>
							<button onClick={() => setOpen(false)} className='btn btn-sm btn-circle'>
								X
							</button>
						</DialogPrimitive.Close>
					</div>
					<div className='mt-5'>{children}</div>
				</div>
			</DialogPrimitive.Content>
		</DialogPrimitive.Portal>
	)
}
export const Dialog = DialogPrimitive.Root
export const DialogTrigger = DialogPrimitive.Trigger
