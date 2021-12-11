import Layout from '../../components/Layout';
import Link from 'next/link'
import Admin from '../../components/auth/Admin';

const AdminIndex = () => {
    return(
        <Layout>
            <Admin>
           <div className="container-fluid">
               <div className="row">
                   <div className="col-md-12 pt-5 pb-5"><h2 style={{color:'darkorchid'}}>Admin Dashboard</h2></div>
                    <div className="col-md-6">
                        <ul class="list-group">
                                <li className="list-group-item">
                                    <Link href="/admin/crud/category-tag">
                                    <a style={{color:'darkorchid'}}>Create Category Or Tag</a>
                                    </Link>
                                </li>
                                <li className="list-group-item">
                                    <a href="/admin/crud/blog" style={{color:'darkorchid'}}>Create Blog</a>
                                </li>

                                <li className="list-group-item">
                                    <Link href="/admin/crud/blogs">
                                    <a style={{color:'darkorchid'}}>Uptade/Delete Blogs</a>
                                    </Link>
                                </li>
                                <li className="list-group-item">
                                    <Link href="/user/update">
                                    <a style={{color:'darkorchid',}}>Update profile</a>
                                    </Link>
                                </li>
                            </ul>
                    </div>
                   {/* <div className="col-md-6">
                       right
                   </div> */}
               </div>
           </div>
            </Admin>
        </Layout>
    )
}

export default AdminIndex;

