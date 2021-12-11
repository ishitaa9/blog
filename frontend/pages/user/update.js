import Layout from '../../Components/Layout';
import Link from 'next/link'
import Private from '../../Components/auth/Private';
import ProfileUpdate from '../../components/auth/ProfileUpdate';


const UserProfileUpdate = () => {
    return (
        <Layout>
           <Private>
           <div className="container-fluid">
               <div className="row">
                   <ProfileUpdate />
               </div>
           </div>
           </Private>
        </Layout>
    )
}

export default UserProfileUpdate;