import Head from 'next/head'

interface Props {
	title?: string
}

export function Metatags(props: Props) {
	return (
		<Head>
			<title>{props.title || 'Notescroll'}</title>
		</Head>
	)
}
