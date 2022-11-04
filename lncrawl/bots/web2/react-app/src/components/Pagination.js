import React from 'react'
import { Link } from 'react-router-dom';

function Pagination({ currentPage, maxPage }) {
    const currentUrl = window.location.pathname.split(/page-\d+\/?/);
    const urlBefore = currentUrl[0];
    const urlAfter = (currentUrl[1] || '') + window.location.search;
    
    const pagination = [];
    if (currentPage === 1) {
        pagination.push(<li key={pagination.length} className="active"><span>1</span></li>)
        if (maxPage >= 2) {
            pagination.push(<li key={pagination.length}><Link to={urlBefore + "page-2" + urlAfter}>2</Link></li>)
        }
        if (maxPage >= 3) {
            pagination.push(<li key={pagination.length}><Link to={urlBefore + 'page-3' + urlAfter}>3</Link></li>)
        }
        if (maxPage >= 4) {
            pagination.push(<li key={pagination.length}><Link to={urlBefore + 'page-4' + urlAfter}>4</Link></li>)
        }
        if (maxPage >= 2) {
            pagination.push(<li key={pagination.length} className='PagedList-skipToNext'><Link to={urlBefore + 'page-2' + urlAfter} rel='next'>&gt;</Link></li>)
        }
        if (maxPage >= 3) {
            pagination.push(<li key={pagination.length} className='PagedList-skipToLast'><Link to={urlBefore + `page-${maxPage}` + urlAfter}>&gt;&gt;</Link></li>)
        }

    } else {
        if (currentPage > 2) {
            pagination.push(<li key={pagination.length} className='PagedList-skipToFirst'><Link to={urlBefore + 'page-1' + urlAfter}>&lt;&lt;</Link></li>)
        }
        if (currentPage > 1) {
            pagination.push(<li key={pagination.length} className='PagedList-skipToPrevious'><Link to={urlBefore + `page-${currentPage - 1}` + urlAfter}>&lt;</Link></li>)
            pagination.push(<li key={pagination.length}><Link to={urlBefore + `page-${currentPage - 1}` + urlAfter}>{currentPage - 1}</Link></li>)
        }
        pagination.push(<li key={pagination.length} className="active"><span>{currentPage}</span></li>)

        if (maxPage > currentPage) {
            pagination.push(<li key={pagination.length}><Link to={urlBefore + `page-${currentPage + 1}` + urlAfter}>{currentPage + 1}</Link></li>)
        }
        if (maxPage > currentPage + 1) {
            pagination.push(<li key={pagination.length}><Link to={urlBefore + `page-${currentPage + 2}` + urlAfter}>{currentPage + 2}</Link></li>)
        }
        if (maxPage >= currentPage + 1) {
            pagination.push(<li key={pagination.length} className='PagedList-skipToNext'><Link to={urlBefore + `page-${currentPage + 1}` + urlAfter} rel="next">&gt;</Link></li>)
        }
        if (maxPage >= currentPage + 2) {
            pagination.push(<li key={pagination.length} className='PagedList-skipToLast'><Link to={urlBefore + `page-${maxPage}` + urlAfter}>&gt;&gt;</Link></li>)
        }



    }

    return (
        <div className="pagenav">
            <div className="pagination-container">
                <ul className="pagination">
                    {pagination}
                </ul>
            </div>
        </div>
    )
}

export default Pagination