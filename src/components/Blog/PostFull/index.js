import React from "react"
import { Link, graphql } from "gatsby"
import Layout from "../BlogLayout/"
import Newsletter from "../../Newsletter"
import Disqus from "../disqus"
import { formatBlogDate } from "../../../utils"
import ShareArticle from "../ShareArticle/ShareArticle"
import QuestionForm from "question-form"
import "question-form/dist/index.css"
import Helmet from "react-helmet"

import Styles from "./index.module.scss"

export default ({ data }) => {
    const post = data.markdownRemark
    const notMonetized = post.frontmatter.monetize === false ? true : false
    return (
        <Layout
            PageTitle={`${post.frontmatter.title} - Dillion's Blog`}
            PageLink={post.fields.slug}
            PageDescription={post.frontmatter.pageDescription}
            PageKeywords={post.frontmatter.pageKeywords}
            ImageCard={post.frontmatter.cover}
            LargeTwitterCard={true}
            //The copyright only shows on the blog page and on each blog for mobile
            // ...But it always shows for large screens
            ShowMobileCopyright
        >
            {notMonetized ? (
                <></>
            ) : (
                <Helmet>
                    <meta
                        name="monetization"
                        content="$ilp.uphold.com/89fH6XniNm9R"
                    />
                </Helmet>
            )}

            <main className={Styles.BlogPost}>
                <article>
                    <div className={Styles.BlogInfo}>
                        <h1 className={Styles.BlogTitle}>
                            {post.frontmatter.title}
                        </h1>
                        <p className={Styles.BlogDate}>
                            {formatBlogDate(post.frontmatter.date)} |{" "}
                            {`${post.timeToRead} min${
                                post.timeToRead > 1 ? "s" : ""
                            } read`}
                        </p>
                        {post.frontmatter.tags ? (
                            <p className={Styles.BlogTags}>
                                {post.frontmatter.tags.map((tag, index) => (
                                    <Link
                                        key={`${tag}_${index}`}
                                        to={`/tags/${tag}`}
                                    >
                                        #{tag}
                                    </Link>
                                ))}
                            </p>
                        ) : null}
                    </div>
                    {post.frontmatter.cover && post.frontmatter.cover !== "" ? (
                        <img
                            src={post.frontmatter.cover}
                            alt="Blog Cover"
                            width="100%"
                        />
                    ) : null}
                    <div className={Styles.BlogContent}>
                        <div dangerouslySetInnerHTML={{ __html: post.html }} />
                    </div>
                </article>

                {post.frontmatter.questions && (
                    <>
                        <h2>Exercise questions</h2>
                        <QuestionForm
                            questions={post.frontmatter.questions}
                            color="var(--mainColor1)"
                        />
                    </>
                )}

                {/* Sharing the article with media APIs */}
                <p
                    style={{
                        fontSize: "25px",
                        fontWeight: "bold",
                        margin: "30px 0 0",
                    }}
                >
                    Share this article
                </p>
                <ShareArticle
                    url={post.fields.slug}
                    title={post.frontmatter.title}
                />
                <hr />

                <Newsletter />

                <Disqus
                    Url={post.fileAbsolutePath}
                    PostId={post.id}
                    PostTitle={post.frontmatter.title}
                />
            </main>
        </Layout>
    )
}

export const query = graphql`
    query($slug: String!) {
        markdownRemark(fields: { slug: { eq: $slug } }) {
            fields {
                slug
            }
            html
            timeToRead
            frontmatter {
                title
                date
                readTime
                pageDescription
                pageKeywords
                cover
                tags
                monetize
                questions {
                    name
                    options
                    answer
                }
            }
        }
    }
`
