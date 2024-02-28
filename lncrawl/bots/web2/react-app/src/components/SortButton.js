import { Link, useSearchParams } from 'react-router-dom'
import { useState } from 'react';
import updateUrlParameter from '../components/UpdateUrlParameter';
function SortButton() {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [searchParams] = useSearchParams();

    const [sort, setSort] = useState(searchParams.get('sort') || 'rank');

    const sortOptions = {
        'rank' : 'Rank',
        'title' : 'Title',
        'rating' : 'Rating',
        'views' : 'Views',
        'author' : 'Author',
        'last_updated' : 'Newest',
        'weekly_views' : 'Active'
    }

    const dropdown = []
    for (const option of Object.keys(sortOptions)) {
        dropdown.push(
            <Link
                className="dropdown-item"
                key={option}
                to={updateUrlParameter(window.location.pathname + window.location.search, 'sort', ((sort === option) ? option + '-reverse' : option))}
                onClick={() => setSort((sort === option) ? option + '-reverse' : option)}
                style={{ 'color' : (sort === option) ? 'var(--text-color-secondary)' : (sort === option + '-reverse') ? 'rgba(199, 45, 34, 0.7)' : null }}
                >
                {sortOptions[option]}
            </Link>
        )
    }


    return (
        <div className="sort-button">
            <div className="dropdown">
                <button className="sort-button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" onClick={() => setDropdownOpen(!dropdownOpen)}>
                    <i className={'icon-sort-alt-' + (sort.includes('reverse') ? 'up' : 'down')}></i>
                </button>
                <div className={`dropdown-menu ${dropdownOpen ? 'show' : ''}`} aria-labelledby="dropdownMenuButton">
                    {dropdown}
                </div>
            </div>
        </div>

    )

}

export default SortButton