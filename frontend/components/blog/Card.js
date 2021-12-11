import { API } from '../../config';
import Link from 'next/link';
import renderHTML from 'react-render-html';
import moment from 'moment'

const Card =({blog}) => {
    const showBlogCategories = blog =>
        blog.categories.map((c, i) => (
            <a key={i} href={`/categories/${c.slug}`}>
                <p className="btn btn-primary mr-1 ml-1 mt-3">{c.name}</p>
            </a>
        ));

    const showBlogTags = blog =>
        blog.tags.map((t, i) => (
            <a key={i} href={`/tags/${t.slug}`}>
                <p className="btn btn-outline-primary mr-1 ml-1 mt-3">{t.name}</p>
            </a>
        ));

    return (
        <div className="lead pb-4">
            <header>
                <a href={`/blogs/${blog.slug}`}>
                    <a>
                        <h2 className="pt-3 pb-3 font-weight-bold">{blog.title}</h2>
                    </a>
                </a>
            </header>
            <section>
                <p className="mark ml-1 pt-2 pb-2">
                    Written by {' '}
                    <a href={`/profile/${blog.postedBy.username}`}>
                        <a>{blog.postedBy.username}</a>
                    </a>
                    | Published {moment(blog.updatedAt).fromNow()}
                    {/* <a href={`/profile/${blog.postedBy.username}`}>
                        <p>{blog.postedBy.username}</p>
                    </a>{' '} */}

                </p>
            </section>
            <section>
                {showBlogCategories(blog)}
                {showBlogTags(blog)}
                <br />
                <br />
            </section>

            <div className="row">
                <div className="col-md-4">
                    <section>
                         <img
                            className="img img-fluid"
                            style={{ maxHeight: 'auto', width: '100%' }}
                            src={`${API}/blog/photo/${blog.slug}`}
                            alt={blog.title}
                        />
                    </section>
                </div>
                <div className="col-md-8">
                    <section>
                        <div className="pb-3">{renderHTML(blog.excerpt)}</div>
                        <a href={`/blogs/${blog.slug}`}>
                            <p className="btn btn-primary pt-2">Read more</p>
                        </a>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Card;
