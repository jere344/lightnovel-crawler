import React, { useEffect, useState } from 'react';
import Metadata from '../components/Metadata';
import { Link, useParams, useNavigate } from 'react-router-dom';
import RatingStars from '../components/RatingStars';
import { nFormatter, toFlag, languageDict } from '../Utils';
import logo from '../assets/logo.bmp'

import "../assets/stylesheets/navbar.min.css"
import "../assets/stylesheets/fontello.css"

import "../assets/stylesheets/novel.min.css"
import "../assets/stylesheets/novel.768.min.css"
import "../assets/stylesheets/media-mobile.min.css"

import "../assets/stylesheets/select.css"


function NovelInfo() {
    const currentUrlSplitted = window.location.href.split('/');

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
        "novel": {
            "author": "Loading ...",
            "chapter_count": 0,
            "clicks": 0,
            "cover": undefined,
            "first": "Loading ...",
            "language": "Loading ...",
            "latest": "Loading ...",
            "overall_rating": 0,
            "prefered_source": currentUrlSplitted[currentUrlSplitted.length - 1],
            "rank": 0,
            "ratings_count": 0,
            "slug": currentUrlSplitted[currentUrlSplitted.length - 2],
            "source_count": 0,
            "sources": {},
            "str_path": "Loading ...",
            "title": currentUrlSplitted[currentUrlSplitted.length - 2],
            "volume_count": 0
        },
        "slug": currentUrlSplitted[currentUrlSplitted.length - 1],
        "str_path": "Loading ...",
        "summary": "Loading ...",
        "title": currentUrlSplitted[currentUrlSplitted.length - 2],
        "volume_count": 0
    });
    useEffect(() => {
        fetch(`/api/novel?novel=${novelSlug}&source=${sourceSlug}`).then(
            response => response.json()
        ).then(
            data => {
                setSource(data);
            }
        )
    }, [novelSlug, sourceSlug]);

    const title = `Read ${source.title} in ${languageDict[source.language]} for free | LnCrawler`;
    const description = `Read ${source.title} in ${languageDict[source.language]} and thousands of famous Light Novels and Web Novels in any language from more that 140 different websites`;
    const imageUrl = logo; // Not an url but whatever
    const imageAlt = "LnCrawler"
    const imageType = "image/bmp"



    const sourceList = [];
    for (const [s, lang] of Object.entries(source.novel.sources)) {
        if (!(s === source.slug)) {
            sourceList.push(<option key={s} value={`/novel/${source.novel.slug}/${s}`}>{toFlag(lang)} - {s}</option>) /* emoji_flag(source.language) */
        }


    }


    return (

        <main role="main">
            <Metadata description={description} title={title} imageUrl={imageUrl} imageAlt={imageAlt} imageType={imageType} />
            <article id="novel" data-novelid="1370" data-volbased="False" itemProp="itemReviewed" itemScope=""
                itemType="http://schema.org/Book">

                <header className="novel-header">
                    <div className="glass-background">
                        {(typeof source.cover === 'undefined') ? (<div>Loading...</div>) : (<img src={`/api/image/${source.cover}`} alt={source.title} itemProp="image" />)}
                        <div className="glass-shade"></div>
                    </div>
                    <div className="header-body container">
                        <div className="fixed-img">
                            <figure className="cover">
                                {(typeof source.cover === 'undefined') ? (<div>Loading...</div>) : <img className=" ls-is-cached lazyloaded" src={`/api/image/${source.cover}`} alt={source.title} />}
                            </figure>
                        </div>
                        <div className="novel-info">
                            <div className="main-head">
                                <h1 itemProp="name" className="novel-title text2row">
                                    {source.title}
                                </h1>
                                <div className="author">
                                    <span>Author: </span>
                                    <span itemProp="author">{source.author}</span>
                                </div>
                                <div className="rating">
                                    <div className="rank">
                                        <span><i className="icon-trophy"></i> Rank {source.novel.rank}</span>
                                    </div>
                                    <div className="rating-star" itemProp="aggregateRating" itemScope="" itemType="https://schema.org/AggregateRating">
                                        <RatingStars rating={source.novel.overall_rating} count={source.novel.ratings_count} />
                                    </div>
                                </div>

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
                                        {(typeof source.language === 'undefined') ? (<div>Loading...</div>) : <img src={`/api/flags/${source.language}`} alt={`${source.language} flag`} style={{ "width": "25px", "marginTop": "4px" }} />}
                                    </strong>
                                    <small>Language</small>
                                </span>

                            </div>

                            <div className="source-select">

                                {/* TODO <select className="sel" onChange={location = this.value}> */}
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
                            to="chapter-1">
                            <div className="body">
                                <h4>FIRST CHAPTER</h4>
                                <p className="latest text1row"> {source.first}</p>
                            </div>
                            <i className="icon-right-open"></i>
                        </Link>
                        <Link className="grdbtn chapter-latest-container" title={source.title + "Chapters"}
                            to="chapterlist">
                            <div className="body">
                                <h4>Novel Chapters</h4>
                                <p className="latest text1row">
                                    latest : {source.latest}
                                </p>

                            </div>
                            <i className="icon-right-open"></i>
                        </Link>

                    </nav>
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


                    </section>
                </div>

            </article>
        </main >
    )
}

export default NovelInfo