import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import "../../assets/stylesheets/featured.css"
function NovelItemFeatured({ novel }) {
    const source = novel
    useEffect(() => {
        if (!source.novel) return
        setColumnHeight()
    }, [source]);

    if (source.novel === undefined) {
        return null
    }

    const novelUrl = `/novel/${source.novel.slug}/${source.slug}`
    const formatter = Intl.NumberFormat('en', { notation: 'compact' })




    function setColumnHeight() {
        const image = document.getElementById("featured-cover")
        const columns = document.querySelectorAll(".featured-column")
        if (!image) return
        const height = image.clientHeight
        columns.forEach(column => {
            column.style.height = `${height}px`
        });
    }
    setColumnHeight()

    window.addEventListener("resize", setColumnHeight)

    return (
        <li className="novel-item-featured">
            <Link className="item-cover featured-column" title={source.title} to={novelUrl}>
                <img id="featured-cover" src={source.cover} alt={source.title} data-src={source.cover} />
            </Link>
            <div className="item-body featured-column">
                <Link title={source.title} to={novelUrl}>
                    <h2 className="novel-title text1row">
                        {source.title}
                    </h2>
                </Link>
                <br />
                <p className="scroll">
                    {novel.summary}
                </p>

                <br />
                <span>
                    <i className="icon-eye">{formatter.format(source.novel.clicks)} (All times)</i>
                    <i className="icon-commenting-o"> {formatter.format(source.novel.comment_count)} comments</i>
                    <i className="icon-star">{source.novel.overall_rating} (Total votes: {formatter.format(source.novel.ratings_count)})</i>
                    <i className="icon-pencil">{source.novel.last_update_date} (Last update)</i>
                    <i className="icon-bookmark">{source.novel.chapter_count} (Total chapters)</i>
                </span>
            </div>
        </li>)
}

export default NovelItemFeatured;