import React from 'react'
import { Link } from 'react-router-dom'

function NovelItemCompactClicks({ novel }) {

    const novelUrl = `/novel/${novel.slug}/${novel.prefered_source}`
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
                <span><i className="icon-eye"></i> {formatter.format(novel.clicks)} (All times)</span>
                <span><i className="icon-commenting-o"></i> {formatter.format(novel.comment_count)} comments</span>
            </div>
        </li>)
}

export default NovelItemCompactClicks