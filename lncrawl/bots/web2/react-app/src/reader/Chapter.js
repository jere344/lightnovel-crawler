import React, { useEffect, useState } from 'react';


import "../assets/stylesheets/navbar.min.css"
import "../assets/stylesheets/media-mobile.min.css"
import "../assets/stylesheets/media-768.min.css"
import "../assets/stylesheets/media-1024.min.css"
import "../assets/stylesheets/media-1270.min.css"
import "../assets/stylesheets/fontello.css"
import "../assets/stylesheets/chaptertts.css"
import "../assets/stylesheets/chapterpg.min.css"
import { Link, useParams } from 'react-router-dom'




function Chapter() {

    function decodeUrlParameter(str) {
        return decodeURIComponent((str + '').replace(/\+/g, '%20'));
    }

    const { novelSlug, sourceSlug, chapterId } = useParams();

    const [response, setResponse] = useState({
        "content": {
            "body": "<p>Loading...</p>",
            "id": 0,
            "title": "Loading...",
            "url": "Loading...",
            "volume": 0,
            "volume_title": "Loading...",
        },
        "is_next": false,
        "is_prev": false,
        "source": {
            "author": "Loading...",
            "chapter_count": 0,
            "cover": undefined,
            "first": "Loading...",
            "language": "en",
            "latest": "Loading...",
            "novel": {
                "author": "Loading...",
                "chapter_count": 0,
                "clicks": 0,
                "cover": undefined,
                "first": "Loading...",
                "language": "en",
                "latest": "Loading...",
                "overall_rating": 0,
                "prefered_source": "Loading...",
                "rank": 0,
                "ratings_count": 0,
                "slug": "Loading...",
                "source_count": 0,
                "sources": {},
                "str_path": "Loading...",
                "title": "Loading...",
                "volume_count": 0
            },
            "slug": "lightnovelreader-org",
            "str_path": "Loading...",
            "summary": "",
            "title": "Loading...",
            "volume_count": 0
        }
    }
    );
    const chapter = response.content;
    const source = response.source;

    useEffect(() => {
        fetch(`/api/chapter/?novel=${novelSlug}&source=${sourceSlug}&chapter=${chapterId}`).then(
            response => response.json()
        ).then(
            data => {
                setResponse(data);
            }
        )
    }, [novelSlug, sourceSlug, chapterId]);


    return (
        <article id="chapter-article" itemScope="" itemType="https://schema.org/CreativeWorkSeries">
            <div className="head-stick-offset"></div>
            <div className="container"></div>
            <section className="page-in content-wrap">
                <div className="titles">
                    <h1 itemProp="headline">
                        <a className="booktitle" href="./" title="{ source.title }" rel="up"
                            itemProp="sameAs">{source.title}</a>
                        <span hidden=""></span>
                        <br />
                        <span className="chapter-title">{response.title}</span>
                    </h1>
                    <div className="control-action-btn">
                        <a href="#chsetting">
                            <svg>
                                {/* <use xlink:href="#i-set"></use> */}
                            </svg>
                        </a>
                    </div>

                </div>
                <div id="chapter-container" className="chapter-content font_default" itemProp="description"
                    style={{ "fontSize": "16px" }} dangerouslySetInnerHTML={{ __html: chapter.body.replaceAll('src="', `src="/api/image/${decodeUrlParameter(novelSlug)}/${decodeUrlParameter(sourceSlug)}/`) }}>
                </div>
                <div className="chapternav skiptranslate">
                    <Link rel="prev" className={`button prevchap ${response.is_prev ? "" : 'isDisabled'}`}
                        to={`/novel/${source.novel.slug}/${source.slug}/chapter-${chapter.id - 1}`}>
                        <i className="icon-left-open"></i>
                        <span>Prev</span>
                    </Link>
                    <Link title="Magic System in a Parallel World Chapter List" className="button chapindex" to={`/novel/${source.novel.slug}/${source.slug}/chapterlist`}>
                        <i className="icon-home"></i>
                        <span>Index</span>
                    </Link>
                    <Link rel="next" className={"button nextchap" + (response.is_next ? "" : 'isDisabled')}
                        to={`/novel/${source.novel.slug}/${source.slug}/chapter-${chapter.id + 1}`}>
                        <span>Next</span>
                        <i className="icon-right-open"></i>
                    </Link>
                </div>
                <dialog className="mobile-title-bar">
                    <div className="bar-body">
                        <i className="bar-nav-back"><svg viewBox="0 0 24 24" fill="none" width="30" height="30">
                            <path d="M6.975 13.3L12 20H9l-6-8 6-8h3l-5.025 6.7H21v2.6H6.975z"></path>
                        </svg></i>
                        <div className="bar-titles">
                            <Link className="booktitle text1row" to={`/novel/${source.novel.slug}/${source.slug}`}
                                title={chapter.title}>{chapter.title}
                            </Link>
                            <span className="chapter-title">{chapter.title}</span>
                        </div>
                    </div>
                </dialog>
                <dialog className="control-action" translate="no" style={{ "display": "none" }}>
                    <nav className="action-items">
                        <div className="action-select">
                            <Link rel="prev" className={(response.is_prev ? "" : 'isDisabled ') + "chnav prev"}
                                to={`/novel/${source.novel.slug}/${source.slug}/chapter-${chapter.id - 1}`}>
                                <i className="icon-left-open"></i>
                                <span>Prev</span>
                            </Link>
                            <Link className="chap-index" title="Chapter Index" to={`/novel/${source.novel.slug}/${source.slug}/chapterlist`}>
                                <i className="icon-home"></i>
                            </Link>
                            <span className="nightmode_switch" title="Night mode" data-night="0" data-content="Dark Theme">
                                <i className="icon-moon"></i>
                            </span>
                            <Link rel="next" className={(response.is_next ? "" : 'isDisabled ') + "chnav next"}
                                to={`/novel/${source.novel.slug}/${source.slug}/chapter-${chapter.id + 1}`}>
                                <span>Next</span>
                                <i className="icon-right-open"></i>
                            </Link>
                        </div>
                        <div className="font-select">
                            <div className="font-wrap">
                                <input type="radio" id="radioDefault" name="radioFont" defaultValue="default" defaultChecked="" />
                                <label htmlFor="radioDefault">Default</label>
                                <input type="radio" id="radioDyslexic" name="radioFont" defaultValue="dyslexic" />
                                <label htmlFor="radioDyslexic">Dyslexic</label>
                                <input type="radio" id="radioRoboto" name="radioFont" defaultValue="roboto" />
                                <label htmlFor="radioRoboto">Roboto</label>
                                <input type="radio" id="radioLora" name="radioFont" defaultValue="lora" />
                                <label htmlFor="radioLora">Lora</label>
                            </div>
                        </div>
                        <div className="action-select range-slider">
                            <span className="svgbtn" id="svgFontMinus">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path fillRule="evenodd" clipRule="evenodd"
                                        d="M14.333 21l-1.703-4.6H5.37L3.667 21H1L7.667 3h2.666L17 21h-2.667zM9 6.6l2.74 7.4H6.26L9 6.6zM23 5h-8v2h8V5z"
                                        fill="#000"></path>
                                </svg>
                            </span>
                            <div className="range-fontsize">
                                <div className="range">
                                    <input type="range" min="1" max="8" step="1" defaultValue="1" />
                                </div>
                                <ul className="range-labels">
                                    <li className="selected">14</li>
                                    <li className="active selected">16</li>
                                    <li>18</li>
                                    <li>20</li>
                                    <li>22</li>
                                    <li>24</li>
                                    <li>26</li>
                                    <li>28</li>
                                </ul>
                            </div>
                            <span className="svgbtn" id="svgFontPlus">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path fillRule="evenodd" clipRule="evenodd"
                                        d="M20 2v3h3v2h-3v3h-2V7h-3V5h3V2h2zm-5.667 19l-1.703-4.6H5.37L3.667 21H1L7.667 3h2.666L17 21h-2.667zM9 6.6l2.74 7.4H6.26L9 6.6z"
                                        fill="#000"></path>
                                </svg>
                            </span>
                        </div>


                    </nav>
                </dialog>
                <div className="guide-message">
                    <span className="mobile">Tap the screen to use reading tools</span>
                    <span className="desktop">Tip: You can use left and right keyboard keys to browse between
                        chapters.</span>
                </div>
            </section>
        </article>
    )
}

export default Chapter