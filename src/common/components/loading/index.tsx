import styles from './loading.module.css'

interface Types {
	loaded: boolean[]
	showSpinner?: boolean
	children?: React.ReactNode
	skeleton?: React.ReactNode
}

export function Loading({
	loaded,
	showSpinner = true,
	children,
	skeleton,
}: Types) {
	if (loaded.every((el) => el === true)) {
		return <>{children || null}</>
	} else {
		if (!showSpinner) return null
		if (skeleton) return <>{skeleton}</>
		return (
			<div className='w-full flex justify-center items-center'>
				<div className={styles.loader}></div>
			</div>
		)
	}
}

export function LoadingSpinner() {
	return (
		<div className='w-full flex justify-center items-center'>
			<div className={styles.loader}></div>
		</div>
	)
}
