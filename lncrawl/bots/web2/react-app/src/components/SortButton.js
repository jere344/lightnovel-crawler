import { Link, useSearchParams } from 'react-router-dom'
import { useState } from 'react';
import updateUrlParameter from '../components/UpdateUrlParameter';
function SortButton() {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [searchParams] = useSearchParams();

    const [sort, setSort] = useState(searchParams.get('sort') || 'rank');

    return (
        <div className="sort-button">
            <div className="dropdown">
                <button className="sort-button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" onClick={() => setDropdownOpen(!dropdownOpen)}>
                    <i className={'icon-sort-alt-' + (sort.includes('reverse') ? 'up' : 'down')}></i>
                </button>
                <div className={`dropdown-menu ${dropdownOpen ? 'show' : ''}`} aria-labelledby="dropdownMenuButton">
                    <Link className="dropdown-item" key="rank" to={
                        updateUrlParameter(window.location.pathname, 'sort', ((sort === 'rank') ? 'rank-reverse' : 'rank'))}
                        onClick={() => setSort((sort === 'rank') ? 'rank-reverse' : 'rank')}>Rank</Link>
                    <Link className="dropdown-item" key="title" to={
                        updateUrlParameter(window.location.pathname, 'sort', ((sort === 'title') ? 'title-reverse' : 'title'))}
                        onClick={() => setSort((sort === 'title') ? 'title-reverse' : 'title')}>Title</Link>
                    <Link className="dropdown-item" key="rating" to={
                        updateUrlParameter(window.location.pathname, 'sort', ((sort === 'rating') ? 'rating-reverse' : 'rating'))}
                        onClick={() => setSort((sort === 'rating') ? 'rating-reverse' : 'rating')}>Rating</Link>
                    <Link className="dropdown-item" key="views" to={
                        updateUrlParameter(window.location.pathname, 'sort', ((sort === 'views') ? 'views-reverse' : 'views'))}
                        onClick={() => setSort((sort === 'views') ? 'views-reverse' : 'views')}>Views</Link>
                    <Link className="dropdown-item" key="author" to={
                        updateUrlParameter(window.location.pathname, 'sort', ((sort === 'author') ? 'author-reverse' : 'author'))}
                        onClick={() => setSort((sort === 'author') ? 'author-reverse' : 'author')}>Author</Link>
                    <Link className="dropdown-item" key="last_updated" to={
                        updateUrlParameter(window.location.pathname, 'sort', ((sort === 'last_updated') ? 'last_updated-reverse' : 'last_updated'))}
                        onClick={() => setSort((sort === 'last_updated') ? 'last_updated-reverse' : 'last_updated')}>Newest</Link>
                </div>
            </div>
        </div>

    )

}

export default SortButton