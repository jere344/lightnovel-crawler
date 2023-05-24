import React from 'react'
import { Link } from 'react-router-dom'

function NovelItemCard({ novel }) {
    const formatter = Intl.NumberFormat('en', { notation: 'compact' })
    const languages = novel.language.split(', ')
    const languagesSpan = [];
    for (let i = 0; i < languages.length; i++) {
        languagesSpan.push(
            <span className="flag-wrap" key={i}><img src={`https://api.lncrawler.monster/flags/${languages[i]}`} alt={`${languages[i]} flag`} /></span>
        );
    }

    const novelUrl = `/novel/${novel.slug}/${novel.prefered_source}`

    return (

        <li className="novel-item">
            <Link title={novel.title} to={novelUrl}>
                <figure className="novel-cover">
                    <img className=" ls-is-cached lazyloaded" src={novel.cover.replace(".jpg", ".sm.jpg")} data-src={novel.cover.replace(".jpg", ".sm.jpg")} alt={novel.title} />
                    <span className="badge _bl">
                        <i className="icon-star" ></i>
                        <span>{formatter.format(novel.overall_rating)}</span>
                    </span>
                </figure>
                <h4 className="novel-title text2row">
                    {novel.title}
                </h4>
            </Link>
            <div className="novel-stats">
                <span className="uppercase"><i className="icon-award"></i> Rank {novel.rank}</span>
                <span><i className="icon-book-open"></i> {novel.chapter_count} Chapters</span>
            </div>
        </li>
    )
}

export default NovelItemCard