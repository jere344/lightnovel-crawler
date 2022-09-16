import React from 'react'
import { Link } from 'react-router-dom'


function NovelItemChapter({ novel }) {
  const source = novel

  const novelUrl = `/novel/${novel.slug}/${novel.prefered_source}`

  const re = new RegExp('(Chapter|Chapitre|Ch) ?[0-9]*.? ?(:|;|-|.)?')
  let chapterName = novel.latest.replace(novel.title, '').replace(re, '').trim()
  // chapterName = novel.latest


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
          <h5 className="chapter-title text1row">Chapter {source.chapter_count} : {chapterName}</h5>
        </Link>
        <div className="novel-stats">
          <span><i className="icon-pencil-2"></i> <time dateTime="2022-09-16 10:09">4 hours ago</time></span>
        </div>
      </div>
    </li>
  )
}

export default NovelItemChapter