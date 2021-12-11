import Layout from '../components/Layout';
import Link from 'next/link'


const Index = () => {
    return(
        <Layout>
            <h2 style={{color:'	darkorchid'}}> Do you even blog?</h2>
            <Link href="/signup">
            <a className="btn btn-primary">Start now!</a>
            </Link>
        </Layout>
    )
}

export default Index;