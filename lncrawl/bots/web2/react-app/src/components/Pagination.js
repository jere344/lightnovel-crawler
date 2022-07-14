import React from 'react'
import { Link } from 'react-router-dom';

function Pagination(page) {
    const maxPage = page.maxPage;
    const currentPage = page.page;
    const currentUrl = window.location.pathname.replace(/page-\d+\/?/, '');

    const pagination = [];
    if (currentPage === 1) {
        pagination.push(<li key={pagination.length} className="active"><span>1</span></li>)
        if (maxPage >= 2) {
            pagination.push(<li key={pagination.length}><Link to={currentUrl + "page-2"}>2</Link></li>)
        }
        if (maxPage >= 3) {
            pagination.push(<li key={pagination.length}><Link to={currentUrl + 'page-3'}>3</Link></li>)
        }
        if (maxPage >= 4) {
            pagination.push(<li key={pagination.length}><Link to={currentUrl + 'page-4'}>4</Link></li>)
        }
        if (maxPage >= 2) {
            pagination.push(<li key={pagination.length} className='PagedList-skipToNext'><Link to={currentUrl + 'page-2'} rel='next'>&gt;</Link></li>)
        }
        if (maxPage >= 3) {
            pagination.push(<li key={pagination.length} className='PagedList-skipToLast'><Link to={currentUrl + `page-${maxPage}`}>&gt;&gt;</Link></li>)
        }

    } else {
        if (currentPage > 2) {
            pagination.push(<li key={pagination.length} className='PagedList-skipToFirst'><Link to={currentUrl + 'page-1'}>&lt;&lt;</Link></li>)
        }
        if (currentPage > 1) {
            pagination.push(<li key={pagination.length} className='PagedList-skipToPrevious'><Link to={currentUrl + `page-${currentPage - 1}`}>&lt;</Link></li>)
            pagination.push(<li key={pagination.length}><Link to={currentUrl + `page-${currentPage - 1}`}>{currentPage - 1}</Link></li>)
        }
        pagination.push(<li key={pagination.length} className="active"><span>{currentPage}</span></li>)

        if (maxPage > currentPage) {
            pagination.push(<li key={pagination.length}><Link to={currentUrl + `page-${currentPage + 1}`}>{currentPage + 1}</Link></li>)
        }
        if (maxPage > currentPage + 1) {
            pagination.push(<li key={pagination.length}><Link to={currentUrl + `page-${currentPage + 2}`}>{currentPage + 2}</Link></li>)
        }
        if (maxPage >= currentPage + 1) {
            pagination.push(<li key={pagination.length} className='PagedList-skipToNext'><Link to={currentUrl + `page-${currentPage + 1}`} rel="next">&gt;</Link></li>)
        }
        if (maxPage >= currentPage + 2) {
            pagination.push(<li key={pagination.length} className='PagedList-skipToLast'><Link to={currentUrl + `page-${maxPage}`}>&gt;&gt;</Link></li>)
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