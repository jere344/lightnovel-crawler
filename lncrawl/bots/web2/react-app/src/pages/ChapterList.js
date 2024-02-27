import Metadata from '../components/Metadata';
import Pagination from '../components/Pagination';
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';


import "../assets/stylesheets/navbar.min.css"
import "../assets/stylesheets/media-mobile.min.css"
import "../assets/stylesheets/media-768.min.css"
import "../assets/stylesheets/media-1024.min.css"
import "../assets/stylesheets/media-1270.min.css"
import "../assets/stylesheets/fontello-embedded.css"
import "../assets/stylesheets/novel.chapter-review.min.css"
import "../assets/stylesheets/pagedlist.css"

import { API_URL } from '../config.js';


function ChapterList() {

    const title = "Read Light Novels Online For Free | LnCrawler";
    const description = "Read world famous Japanese Light Novels, Chinese Light Novels and Korean Light Novels in any language from more that 140 different websites."
    const imageUrl = "WEBSITE_URL + '/static/assets/logo.png'"
    const imageAlt = "LnCrawler"
    const imageType = "image/bmp"
    const { novelSlug, sourceSlug, page: rawPage } = useParams();
    const page = parseInt(rawPage.replace('page-', '')) || 1;

    const [response, setResponse] = useState({
        "content": [
            {
                "id": 0,
                "title": "Loading...",
                "url": undefined,
                "volume": 0,
                "volume_title": "Loading...",
            }
        ]
        ,
        "is_next": false,
        "is_prev": false,
        "total_pages": 1,
        "source": {
            "chapter_count": 0,
            "cover": undefined,
            "latest": "Loading...",
            "summary": "",
            "tags": [],
            "title": "Loading...",
            "novel": {
                "slug": novelSlug,
            },
        }
    }
    );
    const chapter = response.content;
    const source = response.source;

    useEffect(() => {
        fetch(`${API_URL}/chapterlist/?novel=${novelSlug}&source=${sourceSlug}&page=${page}`).then(
            response => response.json()
        ).then(
            data => {
                setResponse(data);
            }
        )
    }, [novelSlug, sourceSlug, page]);


    const pagination = <Pagination currentPage={parseInt(page)} maxPage={parseInt(response.total_pages)} />;


    const chapterList = [];
    for (let i = 0; i < chapter.length; i++) {
        chapterList.push(
            <li data-chapterno={chapter[i].id} data-volumeno={chapter[i].volume} data-orderno={chapter[i].id} key={chapter[i].id}>
                <Link to={`/novel/${source.novel.slug}/${sourceSlug}/chapter-${chapter[i].id}`} title={chapter[i].title}>
                    <span className="chapter-no ">{chapter[i].id}</span>
                    <strong className="chapter-title">
                        {chapter[i].title} </strong>
                </Link>
            </li>
        );
    }


    const [goToChapNoValue, setGoToChapNoValue] = useState(undefined);

    let navigate = useNavigate();
    const routeChange = () => {
        if (goToChapNoValue) {
            navigate(`/novel/${source.novel.slug}/${sourceSlug}/chapter-${goToChapNoValue}`);
        }
    }



    return (
        <main role="main">
            <Metadata description={description} title={title} imageUrl={imageUrl} imageAlt={imageAlt} imageType={imageType} />
            <Helmet>
               <link rel="canonical" href={`/novel/${source.novel.slug}/${sourceSlug}/chapterlist/page-1`} />
            </Helmet>
            <article id="chapter-list-page">
                <header className="container">
                    <div className="novel-item">
                        <div className="cover-wrap">
                            <Link title={source.title} to={`/novel/${source.novel.slug}/${sourceSlug}`}>
                                <figure className="novel-cover">
                                    <img src={source.cover ? `${API_URL}/image/${source.cover}` : undefined} alt={source.title} />
                                </figure>
                            </Link>
                        </div>
                        <div className="item-body">
                            <h1>
                                <Link className="text2row" title={source.title} to={`/novel/${source.novel.slug}/${sourceSlug}`}>{source.title}</Link>
                            </h1>
                        </div>
                    </div>
                    <span className="divider"></span>
                    <h2>{source.title} Chapters - Page {page}</h2>
                    <p dangerouslySetInnerHTML={{ __html: source.summary }} />
                    <br />
                    <p>
                        Latest Release:<br />
                        <Link to={`/novel/${source.novel.slug}/${sourceSlug}/chapter-${source.chapter_count}`} title={source.latest}>{source.latest}</Link>
                    </p>
                </header>
                <section className="container" id="chpagedlist" data-load="0">
                    <svg aria-hidden="true" style={{ position: "absolute", width: "0px", height: "0px", overflow: "hidden" }}>
                        <symbol id="i-rank-up" viewBox="0 0 1308 1024">
                            <path
                                d="M512 149.33333366666665h796.444444v113.777777H512V149.33333366666665z m0 341.333333h568.888889v113.777778H512V490.6666666666667z m0 341.333333h341.333333v113.777778H512v-113.777778zM227.555556 303.6159996666667L100.124444 452.9493336666667 13.653333 379.0506666666667 341.333333-4.949333333333332V1002.6666666666666H227.555556V303.6159996666667z">
                            </path>
                        </symbol>
                    </svg>
                    <div className="filters">
                        <form id="gotochap">
                            <input id="gotochapno" name="chapno" type="number" placeholder="Enter Chapter No" onChange={(e) => { setGoToChapNoValue(e.target.value) }} value={undefined} />
                            <button className="button" onClick={(e) => { routeChange(e) }}>Go</button>
                        </form>
                        <div className="pagenav">
                            <div className="pagination-container">
                                <ul className="pagination">
                                    {pagination}
                                </ul>
                            </div>
                        </div>
                    </div>
                    <ul className="chapter-list">
                        {chapterList}
                    </ul>
                    <div className="pagenav" style={{ paddingTop: "1rem" }}>
                        <div className="pagination-container">
                            <ul className="pagination">
                                {pagination}
                            </ul>
                        </div>
                    </div>
                </section>
            </article>
        </main >
    )
}

export default ChapterList





