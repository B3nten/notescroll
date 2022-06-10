import { Layout } from "./layout"

export default function Campaign() {

    return <div>coming soon...</div>
}

Campaign.getLayout = function getLayout(page) {
    return (
        <Layout>
            {page}
        </Layout>
    )
}