import { Layout } from './layout'

export default function Settings() {
	return <div><iframe src="https://giphy.com/embed/3oEdvbCRLBwQgbmxiw" width="270" height="480" frameBorder="0" allowFullScreen></iframe></div>
}

Settings.getLayout = function getLayout(page: React.ReactNode) {
	return <Layout>{page}</Layout>
}
