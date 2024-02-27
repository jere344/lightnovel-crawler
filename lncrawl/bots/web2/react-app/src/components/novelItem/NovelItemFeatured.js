import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import '../../assets/stylesheets/featured.css'
function NovelItemFeatured ({ novel }) {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
    const source = novel
    window.addEventListener('resize', () => {
        setIsMobile(window.innerWidth < 768)
    })

    if (source.novel === undefined) {
        return null
    }

    let novelUrl = ''
    if (source.novel.slug) {
        novelUrl = `/novel/${source.novel.slug}/${source.slug}`
    }
    const formatter = Intl.NumberFormat('en', { notation: 'compact' })

    function formatTimeAgo (timeAgo) {
        const seconds = Math.floor(timeAgo / 1000)
        const minutes = Math.floor(seconds / 60)
        const hours = Math.floor(minutes / 60)
        const days = Math.floor(hours / 24)
        const months = Math.floor(days / 30)
        const years = Math.floor(months / 12)
        if (seconds < 60) {
            return `${seconds} seconds ago`
        } else if (minutes < 60) {
            return `${minutes} minutes ago`
        } else if (hours < 24) {
            return `${hours} hours ago`
        } else if (days < 30) {
            return `${days} days ago`
        } else if (months < 12) {
            return `${months} months ago`
        } else {
            return `${years} years ago`
        }
    }

    const servertimezone = 0 // server timezone is utc-0
    const usertimezone = new Date().getTimezoneOffset() / 60 // user timezone
    const serverOffset = servertimezone - usertimezone // offset between server and user timezone

    const updateDateInUserTimezone = new Date(
        new Date(source.last_update_date).getTime() + serverOffset * 60 * 60 * 1000
    )
    const formatedTimeAgo = formatTimeAgo(new Date().getTime() - updateDateInUserTimezone.getTime())

    return (
        <li className='novel-item-featured' key={source.slug}>
            <Link className='item-cover featured-column' title={source.title} to={novelUrl}>
                <figure className='novel-cover'>
                    <img id='featured-cover' src={source.cover} alt={source.title} data-src={source.cover} />
                </figure>
            </Link>
            <div className='item-body featured-column'>
                <Link title={source.title} to={novelUrl}>
                    <h2 className='novel-title text1row'>{source.title}</h2>
                </Link>
                <p className='scroll' dangerouslySetInnerHTML={{ __html: source.summary }}></p>
                <span>
                    <i className='icon-eye'>{formatter.format(source.novel.clicks)} (All times)</i>
                    <i className='icon-eye'>{formatter.format(source.novel.current_week_clicks)} (This week)</i>
                    {isMobile ? null : (
                        <i className='icon-commenting-o'> {formatter.format(source.novel.comment_count)} comments</i>
                    )}
                    <i className='icon-star'>
                        {formatter.format(source.novel.overall_rating)} (Votes:{' '}
                        {formatter.format(source.novel.ratings_count)})
                    </i>
                    <i className='icon-pencil'>{formatedTimeAgo}</i>
                    {isMobile ? null : <i className='icon-bookmark'>{source.novel.chapter_count} chapters</i>}
                </span>
            </div>
        </li>
    )
}

export default NovelItemFeatured
