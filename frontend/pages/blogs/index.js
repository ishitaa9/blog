import Head from 'next/head';
import {withRouter} from 'next/router'
import Link from 'next/link';
import Layout from '../../components/Layout'
import React, { useState, useEffect } from 'react';
import { listBlogsWithCategoriesAndTags } from '../../actions/blog';
import Card from '../../components/blog/Card'
import { API, APP_NAME, FB_APP_ID } from '../../config';

const DOMAIN = 'http://localhost:3000';

const Blogs = ({ categories, tags, totalBlogs, blogsLimit, blogSkip, router}) => {
    const head = () => (
        <Head>
            <title>Homepage | {APP_NAME}</title>
            <meta name="description"
                 content="Homepage"/>
            <link ref="canonical" href={`${DOMAIN}${router.pathname}`}/>
            <meta property="og:title" content={`Latest wed development tutorials | ${APP_NAME}`}/>
            <meta property="og:description"
                 content="Homepage"/>

                 <meta property="og:type" content="website"/>
                 <meta property="og:url" content={`${DOMAIN}${router.pathname}`}/>
                 <meta property="og:site_name" content={`${APP_NAME}`}/>

                 <meta property="og:image" content={`${DOMAIN}/static/images/spacerta.jpeg`}/>
                 <meta property="og:image:secure_url" content={`${DOMAIN}/static/images/spacerta.jpeg`}/>
                 <meta property="og:image:type" content='image/jpeg'/>
                 <meta property="fb:app_id" content={`${FB_APP_ID}`}/>
        </Head>
    );


    const [limit, setLimit] = useState(blogsLimit);
    const [skip, setSkip] = useState(0);
    const [size, setSize] = useState(totalBlogs);
    const [loadedBlogs, setLoadedBlogs] = useState([]);

    const loadMore = () => {
        let toSkip = skip + limit
        listBlogsWithCategoriesAndTags(toSkip, limit).then(data => {
            if(data.error) {
                console.log(data.error)
            } else {
                setLoadedBlogs([...loadedBlogs, ...data.blogs])
                setSize(data.size);
                setSkip(toSkip);
            }
        });
    };


    const showAllBlogs = () => {
        return blogs.map((blog, i) => {
            return (
                <article key={i}>
                    <Card blog={blog} />
                    <hr />
                </article>
            );
        })
    }

    const loadMoreButton = () => {
        return (
            size > 0 &&
            size >= limit &&
            (<button onClick={loadMore} className="btn btn-outline-primary btn-lg">
            Load more
            </button>)
        )
    }


    const showAllCategories =() => {
        return categories.map((c, i) => (
            <Link href={`/categories/${c.slug}`} key={i}>
                <a className="btn btn-primary mr-1 ml-1 mt-3">{c.name}</a>
            </Link>
        ))
    }

    const showAllTags =() => {
        return tags.map((t, i) => (
            <Link href={`/tags/${t.slug}`} key={i}>
                <a className="btn btn-outline-primary mr-1 ml-1 mt-3">{t.name}</a>
            </Link>
        ));
    };

    const showLoadedBlogs = () => {
        return loadedBlogs.map((blog, i) => (
            <article key={i}>
                <Card blog={blog} />
            </article>
        ));
    };

    const [blogs, setBlogs] = useState([]);

    useEffect(() => {
        listBlogsWithCategoriesAndTags().then(data => {
            if(data && data.error) {
                console.log(data.error);
            } else  {
                setBlogs(data.blogs);
            }
        });
    },[]);

    return (
        <React.Fragment>
            {head()}
             <Layout>
                <main>
                    <div className="container-fluid">
                        <header>
                            <div className="col-md-12 pt-3">
                                <h1 className="display-4 font-weight-bold text-center" style={{color:'darkorchid'}}>Homepage</h1>
                                <hr />
                            </div>
                            <section>
                              <div className="pb-5 text-center">
                              {showAllCategories()}
                              <br />
                                {showAllTags()}
                              </div>
                            </section>
                        </header>
                    </div>
                    <div className="container-fluid">{showAllBlogs()}</div>
                    <div className="container-fluid">{showLoadedBlogs()}</div>
                    <div className="text-center pt-5 pb-5">{loadMoreButton()}</div>
                </main>
            </Layout>
        </React.Fragment>
    );
};

Blogs.getInitialProps = () => {
    let skip = 0;
    let limit = 2;
    return listBlogsWithCategoriesAndTags(skip, limit).then(data => {
        if(data && data.error) {
            console.log(data.error);
        } else  {
            return {
                blogs: data.blogs,
                categories: data.categories,
                tags: data.tags,
                totalBlogs: data.size,
                blogsLimit: limit,
                blogSkip: skip
            };
        }
    });
};

export default withRouter(Blogs);