import React, { useState } from "react"
import Styles from "./index.module.scss"

import { StaticQuery, graphql } from "gatsby"
import Post from "../PostMini"

const Search = () => {
    const [filteredArticles, setFilteredArticles] = useState([])

    const handleInput = (wholeArr, event) => {
        const query = event.target.value.toLowerCase()

        // check if the query is blank because the every post will pass the filter test for an empty input
        if (query === "") {
            setFilteredArticles([])
            return
        }
        const posts = wholeArr.edges
        const filteredArr = posts.filter(post => {
            const { pageDescription, title, tags } = post.node.frontmatter

            return (
                pageDescription.toLowerCase().includes(query) ||
                title.toLowerCase().includes(query) ||
                tags
                    .join("")
                    .toLowerCase()
                    .includes(query)
            )
        })
        setFilteredArticles(filteredArr)
    }

    return (
        <StaticQuery
            query={graphql`
                query {
                    allPosts: allMarkdownRemark(
                        sort: { fields: [frontmatter___date], order: DESC }
                        filter: { fields: { slug: { regex: "/^(/p/)/" } } }
                    ) {
                        totalCount
                        edges {
                            node {
                                id
                                frontmatter {
                                    title
                                    date
                                    pageDescription
                                    tags
                                }
                                timeToRead
                                fields {
                                    slug
                                }
                            }
                        }
                    }
                }
            `}
            render={data => {
                const { allPosts } = data

                const filtered = filteredArticles

                return (
                    <main className={Styles.SearchMain}>
                        <h1>Search from {allPosts.totalCount} posts</h1>
                        <div className={Styles.Search}>
                            <input
                                type="text"
                                placeholder="Search articles..."
                                onChange={event => {
                                    handleInput(allPosts, event)
                                }}
                            />
                        </div>
                        {filtered.length !== 0 && (
                            <p className={Styles.ResultCount}>
                                <b>{filtered.length}</b> result
                                {filtered.length !== 1 && "s"} found.
                            </p>
                        )}
                        {filtered.length !== 0 ? (
                            <section>
                                {filtered.map(({ node }) => (
                                    <Post
                                        href={node.fields.slug}
                                        title={node.frontmatter.title}
                                        readTime={node.timeToRead}
                                        date={node.frontmatter.date}
                                        tags={node.frontmatter.tags}
                                        content={
                                            node.frontmatter.pageDescription
                                                .length > 150
                                                ? `${node.frontmatter.pageDescription.substr(
                                                      0,
                                                      150
                                                  )}...`
                                                : node.frontmatter
                                                      .pageDescription
                                        }
                                    />
                                ))}
                            </section>
                        ) : null}
                    </main>
                )
            }}
        />
    )
}

export default Search
