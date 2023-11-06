import React from 'react'
import { Link } from 'react-router-dom'
import RatingStars from '../RatingStars'

function NovelItemCompactRating({ novel }) {
    let novelUrl = ""
    if (novel.slug) {
        novelUrl = `/novel/${novel.slug}/${novel.prefered_source}`
    }
    const formatter = Intl.NumberFormat('en', { notation: 'compact' })
    return (
        <li className="novel-item compact">
            <Link className="item-cover" title={novel.title} to={novelUrl}>
                <div className="novel-cover">
                    <img className=" ls-is-cached lazyloaded" data-src={novel.cover.replace(".jpg", ".min.jpg")} src={novel.cover.replace(".jpg", ".min.jpg")} alt={novel.title} />
                </div>
            </Link>
            <div className="item-body">
                <Link title={novel.title} to={novelUrl}>
                    <h4 className="novel-title text1row">
                        {novel.title}
                    </h4>
                </Link>
                <div className="novel-stats">
                    <div className="rating-star">
                        <RatingStars rating={novel.overall_rating} count={novel.ratings_count} novel={novel.slug} />
                    </div>
                </div>
                <span><i className="icon-eye"></i> {formatter.format(novel.clicks)} (All times)</span>
            </div>
        </li>)
}

export default NovelItemCompactRating