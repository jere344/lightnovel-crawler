import React from 'react'
import { Link } from 'react-router-dom';

function TagList({ tags }) {
    if (tags.length === 0) {
        return <></>
    }
            
    const tagsLi = []
    tags.forEach(tag => {
        tagsLi.push(<li key={tag}>
            <Link className="tag" to={`/browse/page-1?tags=${tag}`} title={tag} >
                {tag}
            </Link>
        </li>)
    });



    return (
        <div className="expand-wrapper">
            <ul className="content">
                {tagsLi}
            </ul>
            <div className="expand">
                <button className="expand-btn"><i className="icon-right-open"></i> <span>Show More</span></button>
            </div>
        </div>
    )
}

export default TagList