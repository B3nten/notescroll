import * as Dialog from '@radix-ui/react-dialog'
import * as AlertDialog from '@radix-ui/react-alert-dialog'
import styles from './dialog.module.css'

interface Props {
    trigger: React.ReactNode,
    children: React.ReactNode,
    title?: string | React.ReactNode,
    alert?: boolean,
    action?: React.ReactNode,
    cancel?: React.ReactNode
}

function DialogComponent({ trigger, children, title = '', alert = false, action, cancel }: Props) {

    if (!alert) {
        return (
            <Dialog.Root>
                <Dialog.Trigger asChild>
                    {trigger}
                </Dialog.Trigger>
                <Dialog.Portal>
                    <Dialog.Overlay className={styles.dialogoverlay}>
                        <div className='fixed inset-0 bg-amber-800 bg-opacity-20 saturate-[.1]'></div>
                    </Dialog.Overlay>
                    <Dialog.Content className={styles.dialogcontent}>
                        <div className='fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#e7dccc] p-4 rounded-lg shadow-lg'>
                            <div className="flex w-full justify-between items-end">
                                <Dialog.Title className='font-fancy text-2xl mr-10'>
                                    {title}
                                </Dialog.Title>
                                <Dialog.Close asChild >
                                    <button
                                        className='h-6 w-6 rounded-full bg-amber-300 bg-opacity-40 text-lg hover:bg-opacity-100 transition-all'>
                                        X
                                    </button>
                                </Dialog.Close>
                            </div>
                            <div className="mt-5">
                                {children}
                            </div>
                        </div>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        )
    } else if (alert) {
        return (
            <AlertDialog.Root>
                <AlertDialog.Trigger asChild>
                    {trigger}
                </AlertDialog.Trigger>
                <AlertDialog.Portal>
                    <AlertDialog.Overlay className={styles.dialogoverlay}>
                        <div className='fixed inset-0 bg-amber-800 bg-opacity-20 saturate-[.1]'></div>
                    </AlertDialog.Overlay>
                    <AlertDialog.Content className={styles.dialogcontent}>
                        <div className='fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#e7dccc] p-4 rounded-lg shadow-lg'>
                            <div className="flex w-full justify-between items-end">
                                <AlertDialog.Title className='font-fancy text-2xl mr-10'>
                                    {title}
                                </AlertDialog.Title>
                            </div>
                            <div className="mt-5">
                                {children}
                                <div className='flex justify-around mt-5'>
                                    <AlertDialog.Cancel asChild>
                                        {cancel}
                                    </AlertDialog.Cancel>
                                    <AlertDialog.Action asChild>
                                        {action}
                                    </AlertDialog.Action>
                                </div>
                            </div>
                        </div>
                    </AlertDialog.Content>
                </AlertDialog.Portal>
            </AlertDialog.Root>
        )
    }else return null
}

export { DialogComponent as Dialog }