import React from 'react'
import { Link } from 'react-router-dom'


function NovelItemChapter({ novel }) {
  const source = novel

  const novelUrl = `/novel/${source.novel.slug}/${source.slug}`

  const re = new RegExp('(Chapter|Chapitre|Ch) ?[0-9]*.? ?(:|;|-|.)?')
  let chapterName = source.latest.replace(source.title, '').replace(re, '').trim()
  // chapterName = novel.latest

  function formatTimeAgo(timeAgo) {
    const seconds = Math.floor(timeAgo / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(months / 12);
    if (seconds < 60) {
      return `${seconds} seconds ago`;
    } else if (minutes < 60) {
      return `${minutes} minutes ago`;
    } else if (hours < 24) {
      return `${hours} hours ago`;
    } else if (days < 30) {
      return `${days} days ago`;
    } else if (months < 12) {
      return `${months} months ago`;
    } else {
      return `${years} years ago`;
    }
  }

  const date = new Date(source.last_update_date)
  const formatedTimeAgo = formatTimeAgo((new Date().getTime()) - date.getTime())

  
  const serverOffset = -5 // server timezone is utc-5
  const updateDate = new Date(new Date(source.last_update_date).getTime() - serverOffset * 3600000) // 3600000 = 1 hour in ms //is a Date
  const userDate = new Date().getTime() + (new Date().getTimezoneOffset() * 60 * 1000) // is a ms since epoch
  const timeAgo = userDate - updateDate.getTime();

  const formatedTimeAgo = formatTimeAgo(timeAgo)
  
  
  return (
    <li className="novel-item">
      <div className="cover-wrap">
        <Link to={`${novelUrl}/chapter-${source.chapter_count}`} title={source.latest}>
          <figure className="novel-cover">
            <img className="lazyload" data-src={`/api/image/${source.cover}`} src={`/api/image/${source.cover}`} alt={source.title} />
          </figure>
        </Link>
      </div>
      <div className="item-body">
        <Link to={`${novelUrl}/chapter-${source.chapter_count}`} title={source.latest}>
          <h4 className="novel-title text1row">{source.title}</h4>
          <h5 className="chapter-title text1row">Chapter {source.chapter_count}{chapterName ? ` : ${chapterName}` : ""}</h5>
        </Link>
        <div className="novel-stats">
          <span><i className="icon-pencil-2"></i> <time dateTime={updateDate}>{formatedTimeAgo}</time></span>
        </div>
      </div>
    </li>
  )
}

export default NovelItemChapter
