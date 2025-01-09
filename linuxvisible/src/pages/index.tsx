import Head from "next/head"
import Dashboard from "./dashboard"

const Page: React.FC = () => {
    return (
        <>
        <Head>
            <title>Linux设计底图</title>
        </Head>
        <Dashboard></Dashboard>
        </>
    )
}

export default Page