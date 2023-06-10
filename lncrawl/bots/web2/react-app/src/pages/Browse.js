import React, { useEffect, useState } from 'react';
import Metadata from '../components/Metadata';
import NovelList from '../components/NovelList';
import Pagination from '../components/Pagination';
import SortButton from '../components/SortButton';
import { useParams, useSearchParams } from 'react-router-dom';
import { WEBSITE_URL, API_URL } from '../config.js'

import "../assets/stylesheets/navbar.min.css"
import "../assets/stylesheets/media-mobile.min.css"
import "../assets/stylesheets/media-768.min.css"
import "../assets/stylesheets/media-1024.min.css"
import "../assets/stylesheets/media-1270.min.css"
import "../assets/stylesheets/fontello-embedded.css"
import "../assets/stylesheets/pagedlist.css"
import "../assets/stylesheets/browsepg.min.css"
import SelectTags from '../components/SelectTags';

import { Helmet } from 'react-helmet';


function Browse() {

    const title = "Read Light Novels Online For Free | LnCrawler";
    const description = "Read world famous Japanese Light Novels, Chinese Light Novels and Korean Light Novels in any language from more that 140 different websites."
    const imageUrl = "WEBSITE_URL + '/static/assets/logo.png'"
    const imageAlt = "LnCrawler"
    const imageType = "image/bmp"

    const [novels, setNovels] = useState({});
    const { page } = useParams();
    const [searchParams] = useSearchParams();
    const sort = searchParams.get('sort') || 'rank';
    const tags = searchParams.get('tags') || '';

    useEffect(() => {
        const type = sort.startsWith('last_updated') ? 'sources' : 'novels';
        fetch(`${API_URL}/${type}?page=${parseInt(page) - 1}&sort=${sort}&tags=${tags}`).then(
            response => response.json()
        ).then(
            data => {
                setNovels(data);
            }
        )
    }, [page, sort, tags]);


    const pagination = ((typeof novels.metadata === 'undefined') ? <div>Loading ...</div> : <Pagination currentPage={parseInt(page)} maxPage={novels.metadata.total_pages} />);



    return (


        <main role="main">
            <Metadata description={description} title={title} imageUrl={imageUrl} imageAlt={imageAlt} imageType={imageType} />
            <Helmet>
                <link rel="canonical" href={WEBSITE_URL + "/browse"} />
            </Helmet>
            <article id="explore">
                <div className="container">
                    <div className="action-panel">
                        <h4 className="title">Tags</h4>
                        <SelectTags urlWithoutTags={`/browse/page-${page}?sort=${sort}&`}></SelectTags>
                    </div>
                    <header id="Result">
                    {window.innerWidth > 768 ?
                        <>
                            <h1>{title}</h1>
                            <p className="description">{description}</p>
                        </>
                        : null}
                        <div className='pagefilter'>
                            {pagination}
                            <SortButton url={`/browse/page-${page}`} key={2} />
                        </div>
                    </header>
                    {(<NovelList novels={novels.content || null} className="novel-list horizontal col2" type={sort.startsWith('last_updated') ? 'chapter' : 'classic'} placeholderAmount='20' />)}
                    <footer className="pagination" style={{ "height": "auto" }}>
                        {pagination}
                    </footer>
                </div>
            </article>
        </main>
    )
}

export default Browse