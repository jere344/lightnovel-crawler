import "../assets/stylesheets/fontello-embedded.css"
import React, { useEffect, useState } from 'react';
import Metadata from '../components/Metadata';
import { Link, useParams, useNavigate } from 'react-router-dom';
import RatingStars from '../components/RatingStars';
import { nFormatter, toFlag, languageDict } from '../Utils';
import CommentComponent from '../components/commentsComponents/CommentComponent';
import TagList from '../components/TagList';
import { Helmet } from 'react-helmet';

import "../assets/stylesheets/navbar.min.css"
import "../assets/stylesheets/novel.min.css"
import "../assets/stylesheets/novel.768.min.css"
import "../assets/stylesheets/media-mobile.min.css"
import "../assets/stylesheets/select.css"

import { API_URL } from '../config.js'

import RateSource from '../components/RateSource.js'
import { useCookies } from 'react-cookie'

function NovelInfo() {
    const currentUrlSplitted = window.location.href.split('/');
    const [updateHook, setUpdateHook] = useState(0);
    let _navigate = useNavigate();
    const routeChange = (path) => {
        _navigate(path);
    }

    const { novelSlug, sourceSlug } = useParams();

    const [source, setSource] = useState({
        "author": "Loading...",
        "chapter_count": 0,
        "cover": undefined,
        "first": "Loading ...",
        "language": "en",
        "latest": "Loading ...",
        "url": "Loading ...",
        "novel": {
            "chapter_count": 0,
            "clicks": 0,
            "first": "Loading ...",
            "latest": "Loading ...",
            "overall_rating": 0,
            "user_rating": null,
            "rank": 0,
            "ratings_count": 0,
            "source_count": 0,
            "sources": {},
            "slug": novelSlug,
        },
        "slug": currentUrlSplitted[currentUrlSplitted.length - 1],
        "summary": "Loading ...",
        "tags": [],
        "title": currentUrlSplitted[currentUrlSplitted.length - 2],
    });
    useEffect(() => {
        fetch(`${API_URL}/novel?novel=${novelSlug}&source=${sourceSlug}`).then(
            response => response.json()
        ).then(
            data => {
                setSource(data);
            }
        )
    }, [novelSlug, sourceSlug, updateHook]);

    const title = `Read ${source.title} in ${languageDict[source.language]} for free | LnCrawler`;
    const description = `Read ${source.title} in ${languageDict[source.language]} and thousands of famous Light Novels and Web Novels in any language from more that 140 different websites`;
    const imageUrl = `${API_URL}/image/${source.cover}`;
    const imageAlt = `${source.title} cover`;
    const imageType = "image/bmp"

    const tags = <TagList tags={source.tags} />;

    const sourceList = [];
    for (const [s, lang] of Object.entries(source.novel.sources)) {
        if (!(s === source.slug)) {
            sourceList.push(<option key={s} value={`/novel/${source.novel.slug}/${s}`}>{toFlag(lang)} - {s}</option>) /* emoji_flag(source.language) */
        }


    }
    const [updating, setUpdating] = useState(false);
    const [status, setStatus] = useState(null);

    const sleep = (milliseconds) => {
        return new Promise(resolve => setTimeout(resolve, milliseconds))
    }

    const jobId = Math.random().toString().slice(2);

    async function update_novel() {
        setUpdating(true);
        // polling system => if the job is not finished yet, we wait for 1 second and we poll again
        let response = false;
        let finished = false;
        while (!finished) {
            response = await fetch(`${API_URL}/addnovel/update?job_id=${jobId}&&url=${source.url}`).then(res => res.json());

            if (response.status === "success") {
                finished = true;
                setStatus("success");
                if (response.url !== "") {
                    let new_url = response.url.split('/');
                    console.log(new_url);
                    if (new_url[0] !== novelSlug || new_url[1] !== sourceSlug) {
                        routeChange(`/novel/${new_url[0]}/${new_url[1]}`);
                    }
                }
                sleep(1000).then(() => { setStatus(null); setUpdating(false); setUpdateHook(updateHook + 1); });
            } else if (response.status === "pending") {
                setStatus(response.message)
                await sleep(3000); // wait 3 seconds and try again
            } else if (response.status === "error") {
                finished = true;
                setStatus(response.message)
                await sleep(1000).then(() => { setStatus(null); setUpdating(false); });
            } else {
                console.log("Unexpected response :", response);
                setStatus("Unexpected response", response);
                finished = true;
            }
        }

        setUpdateHook(updateHook + 1);// force a re-fetch and re-render of the page

        setUpdating(false);
        return response
    }


    // eslint-disable-next-line no-extend-native
    String.prototype.replaceAll = function(strReplace, strWith) {
        // See http://stackoverflow.com/a/3561711/556609
        var esc = strReplace.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
        var reg = new RegExp(esc, 'ig');
        return this.replace(reg, strWith);
    };
    
    const firstChapterName = source.first.replaceAll(source.title, '').trim() || source.first
    const latestChapterName = source.latest.replaceAll(source.title, '').trim() || source.latest

    var updateBtn = <></>
    // LnCrawler is the only source that cannot be updated
    if (source.slug !== "LnCrawler") {
         updateBtn = (<div className="minibtn-container">
                <button onClick={() => update_novel()} className={"minibtn" + (updating ? " isDisabled" : "")}>
                    UPDATE
                </button>
            {status ? <p className="updateStatus">{status}</p> : null}
            </div>
        )
    }
    
    const [RateSourceElement, setRateSourceElement] = useState(<></>);

    const [, setDoNotShowRateCookie] = useCookies(['doNotShowRate'])
    function setDoNotShowRate(bool) {
        setDoNotShowRateCookie('doNotShow', bool, { path: '/', sameSite: 'strict', maxAge: 2592000 });
    }


    const [userRating, setUserRating] = useState(source.novel.user_rating);
    useEffect(() => {
        setUserRating(source.novel.user_rating);
    }, [source.novel.user_rating]);

    return (

        <main role="main">
            <Metadata description={description} title={title} imageUrl={imageUrl} imageAlt={imageAlt} imageType={imageType} />
            <Helmet>
                <meta name="robots" content="index" />
                <link rel="canonical" href={`/novel/${source.novel.slug}/${sourceSlug}`} />
            </Helmet>
            <article id="novel" itemProp="itemReviewed" itemScope="" itemType="http://schema.org/Book">

                <header className="novel-header">
                    <div className="glass-background">
                        {(typeof source.cover === 'undefined') ? ("") : (<img src={`${API_URL}/image/${source.cover}`} alt={source.title} itemProp="image" />)}
                        <div className="glass-shade"></div>
                    </div>
                    <div className="header-body container">
                        <div className="fixed-img">
                            <figure className="cover">
                                {(typeof source.cover === 'undefined') ? (<div>Loading...</div>) : <img className=" ls-is-cached lazyloaded" src={`${API_URL}/image/${source.cover}`} alt={source.title} />}
                            </figure>
                        </div>
                        <div className="novel-info">
                            <div className="main-head">
                                <h1 itemProp="name" className="novel-title text2row">
                                    <a href={source.url}>{source.title}</a>
                                </h1>
                                <div className="author">
                                    <span>Author: </span>
                                    <span itemProp="author">{source.author}</span>
                                </div>
                                <div className="rating">
                                    <div className="rank">
                                        <span><i className="icon-award"></i> Rank {source.novel.rank}</span>
                                    </div>
                                    <div className="rating-star" itemProp="aggregateRating" itemScope="" itemType="https://schema.org/AggregateRating">
                                        <RatingStars rating={source.novel.overall_rating} count={source.novel.ratings_count} novel={source.novel.slug} passUserRateAfterVote={setUserRating}/>
                                    </div>
                                </div>
                                {/* <div className="user-note">
                                    <span className="note">Note: </span>
                                    <span className="text">{source.novel.note}</span>
                                </div> */}
                                {source.novel.user_rating ? (
                                    <div className="user-rating">
                                        <span className="user-note">Your note: </span>
                                        <RatingStars rating={userRating} novel={source.novel.slug} displayAverage={false} passUserRateAfterVote={setUserRating} />
                                    </div>
                                ) : null}

                            </div>

                            <div className="header-stats">
                                <span>
                                    <strong><i className="icon-book-open"></i> {source.chapter_count}</strong>
                                    <small>Chapters</small>
                                </span>
                                <span>
                                    <strong><i className="icon-tags"></i> {source.novel.source_count}</strong>
                                    <small>Sources</small>
                                </span>
                                <span>
                                    <strong><i className="icon-eye"></i> {nFormatter(source.novel.clicks)}</strong>
                                    <small>Views</small>
                                </span>
                                <span>
                                    <strong style={{ "alignSelf": "center" }} >
                                        {(typeof source.language === 'undefined') ? (<div>Loading...</div>) : <img src={`${API_URL}/flags/${source.language}`} alt={`${source.language} flag`} style={{ "width": "25px", "marginTop": "4px", "height": "auto" }} width="16" height="12"/>}
                                    </strong>
                                    <small>Language</small>
                                </span>

                            </div>

                            <div className="source-select">
                                <select className="sel" onChange={e => routeChange(e.target.value)} >
                                    <option value={`/novel/${source.novel.slug}/${source.slug}`}>{toFlag(source.language)} - {source.slug}</option>
                                    {sourceList}
                                </select>

                            </div>

                        </div>
                    </div>
                </header>
                <div className="novel-body container">
                    <nav className="content-nav">
                        <Link className="grdbtn reviews-latest-container" title={source.title + "First Chapter"}
                            to={`/novel/${source.novel.slug}/${sourceSlug}/chapter-1`}>
                            <div className="body">
                                <h4>FIRST CHAPTER</h4>
                                <p className="latest text1row"> {firstChapterName}</p>
                            </div>
                            <i className="icon-right-open"></i>
                        </Link>
                        <Link className="grdbtn chapter-latest-container" title={source.title + "Chapters"}
                            to={`/novel/${source.novel.slug}/${sourceSlug}/chapterlist/page-1`}>
                            <div className="body">
                                <h4>Novel Chapters</h4>
                                <p className="latest text1row">
                                    latest : {latestChapterName}
                                </p>

                            </div>
                            <i className="icon-right-open"></i>
                        </Link>
                    </nav>
                    {updateBtn}
                    <div className="minibtn-container">
                        <button 
                            onClick={() => { 
                                setDoNotShowRate(false);
                                setRateSourceElement(<RateSource novelSlug={source.novel.slug} sourceSlug={sourceSlug} />);
                            }} 
                            className={"minibtn"}
                        >
                            RATE SOURCE
                        </button>
                    </div>
                    <section className="rate-source">
                        {RateSourceElement}
                    </section>
                    <section id="info">
                        <div className="summary">
                            <h4 className="lined">Summary</h4>
                            <div className="content expand-wrapper show">
                                <p dangerouslySetInnerHTML={{ __html: source.summary }} />
                                <div className="expand">
                                    <button className="expand-btn">
                                        <i className="icon-right-open"></i>
                                        <span>Show More</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="tags">
                            <h4 className="lined">Tags</h4>
                            <div className="content">
                                <ul className="tag-list">
                                    {tags}
                                </ul>
                            </div>
                        </div>
                        <CommentComponent currentUrl={window.location.pathname} />
                    </section>
                </div>

            </article>
        </main >
    )
}

export default NovelInfo