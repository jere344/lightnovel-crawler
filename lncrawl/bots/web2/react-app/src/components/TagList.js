import React from 'react'
import { Link } from 'react-router-dom';

function TagList({ tags }) {
    console.log(tags)
    if (tags.length === 0) {
        return <></>
    }
            
    const tagsLi = []
    tags.forEach(tag => {
        tagsLi.push(<li>
            <Link class="tag" to={`/browse/page-1?tags=${tag}`} title={tag} key={tag}>
                {tag}
            </Link>
        </li>)
    });



    return (
        <div class="expand-wrapper">
            <ul class="content">
                {tagsLi}
            </ul>
            <div class="expand">
                <button class="expand-btn"><i class="icon-right-open"></i> <span>Show More</span></button>
            </div>
        </div>
    )
}

export default TagList