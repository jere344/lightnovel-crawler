import React from 'react'
import RatingStars from '../RatingStars';
import { Link } from 'react-router-dom'

function NovelItemClassic(novel) {
  novel = novel.novel

  const languages = novel.language.split(', ')
  const languagesSpan = [];
  for (let i = 0; i < languages.length; i++) {
    languagesSpan.push(
      <span className="flag-wrap" key={i}><img src={`/api/flags/${languages[i]}`} alt={`${languages[i]} flag`} /></span>
    );
  }

  const novelUrl = `/novel/${novel.slug}/${novel.prefered_source}`

  return (
    <li className="novel-item" >
      <div className="cover-wrap">
        <Link title={novel.title}
          to={novelUrl}>
          <figure className="novel-cover">
            <img className="lazyload" src={novel.cover} alt={novel.title} />
          </figure>
          <div className="novel-languages">
            {languagesSpan}
          </div>
        </Link>

      </div>
      <div className="item-body">
        <h4 className="novel-title text1row">
          <Link title={novel.title}
            to={novelUrl}>
            {novel.title}
          </Link>
        </h4>
        <div className="novel-stats">
          <div className="rating-star">
            <RatingStars rating={novel.overall_rating} count={novel.ratings_count} novel={novel.slug} />
          </div>
        </div>
        <div className="novel-stats">
          <span><i className="icon-award"></i> Rank {novel.rank}</span>
          <span><i className="icon-user-circle-o"></i> {novel.author}</span>
        </div>
        <div className="novel-stats">
          <span><i className="icon-book-open"></i> {novel.chapter_count} Chapters</span>
          <span><i className="icon-tags"></i> {novel.source_count} Sources</span>
        </div>
        <div className="novel-stats">
          <span><i className="icon-pencil"></i> {novel.latest}</span>
        </div>

      </div>
    </li>
  )
}

export default NovelItemClassic