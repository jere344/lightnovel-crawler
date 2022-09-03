import React, { useEffect, useState, useRef } from 'react';
import { Link, useParams } from 'react-router-dom'
import { useCookies } from 'react-cookie';

import "../assets/stylesheets/chapterpg.min.css"

import SettingsWheel from '../components/SettingsWheel';
import Metadata from '../components/Metadata';





function Chapter() {

    // -------------  Dark mode -----------------

    const [darkModeCookie, setDarkModeCookie] = useCookies(['darkMode']);
    function switchDarkMode() {
        setDarkModeCookie('darkMode', (!(darkModeCookie.darkMode === 'true')).toString(), { path: '/', sameSite: 'strict' });
    }



    // -----------------  Font size -----------------

    const fontSizes = ["12", "14", "16", "18", "20", "22", "24", "26", "28"]

    const [fontSizeCookie, setFontSizeCookie] = useCookies(['fontSize']);

    function setFontSize(size) {
        setFontSizeCookie('fontSize', size.toString(), { path: '/', sameSite: 'strict' });
        document.getElementById("fontsize-slider").value = size
    }

    if (fontSizeCookie.fontSize === undefined) {
        setFontSize("18");
    }
    const fontRangeOption = []

    fontSizes.forEach(
        (fontSize) => {
            fontRangeOption.push(
                <li className={(fontSize === fontSizeCookie.fontSize ? "active " : "") + (fontSize <= parseInt(fontSizeCookie.fontSize) ? "selected" : "")}
                    key={fontSize}
                    onClick={() => { setFontSize(fontSize) }}>
                    {fontSize}
                </li >
            )
        });

    const fontSizeInt = parseInt(fontSizeCookie.fontSize)
    const fontSizeStartInt = parseInt(fontSizes[0])
    const fontSizeEndInt = parseInt(fontSizes[fontSizes.length - 1])
    const percent = (fontSizeInt - fontSizeStartInt) / (fontSizeEndInt - fontSizeStartInt) * 100
    const linearGradient = `linear-gradient(to right, var(--anchor-color) 0%, var(--anchor-color) ${percent}%, #b2b2b2 ${percent}%, #b2b2b2 100%)`;

    const rangeStyle = {
        "input": {
            "&::-webkit-slider-runnable-track ": {
                "background": linearGradient,
            },
            "&::-moz-range-track ": {
                "background": linearGradient,
            },
            "&::-ms-track ": {
                "background": linearGradient,
            }
        },
        "background": linearGradient,

    }



    function decodeUrlParameter(str) {
        return decodeURIComponent((str + '').replace(/\+/g, '%20'));
    }



    // -----------------  Setting pannel -----------------

    const [menuOpen, setMenuOpen] = useState(false);


    const innerRef = useOuterClick(ev => {
        setMenuOpen(false);
    });


    // -----------------  Font -----------------

    const [fontCookie, setFontCookie] = useCookies(['font']);
    function setFont(font) {
        setFontCookie('font', font, { path: '/', sameSite: 'strict' });
    }

    if (fontCookie.font === undefined) {
        setFont("font_default");
    }



    // -----------------  Chapter -----------------

    const { novelSlug, sourceSlug, chapterId } = useParams();

    const [response, setResponse] = useState({
        "content": {
            "body": "<p>Loading...</p>",
            "id": chapterId,
            "title": novelSlug,
            "url": "Loading...",
            "volume": 0,
            "volume_title": "Loading...",
        },
        "is_next": false,
        "is_prev": false,
        "source": {
            "cover": undefined,
            "novel": {
                "language": "Loading...",
            },
            "title": "Loading...",
        }
    }
    );


    useEffect(() => {
        fetch(`/api/chapter/?novel=${novelSlug}&source=${sourceSlug}&chapter=${chapterId}`).then(
            (response) => { return ((response.status === 404) ? undefined : response.json()) }
        ).then(
            data => {
                setResponse(data);
            }
        )
    }, [novelSlug, sourceSlug, chapterId]);
    if (response === undefined) {

        return (
            <main role="main">
                <article id="chapter-article" itemScope="" itemType="https://schema.org/CreativeWorkSeries">
                    <section className="page-in content-wrap" ref={innerRef}>
                        <p>This chapter does not exist</p>
                        <Link to={`/novel/${novelSlug}/${sourceSlug}/chapter-1`}>Chapter 1</Link>
                        <br />
                        <Link to={`/novel/${novelSlug}/${sourceSlug}/chapterlist/page-1`}>Index</Link>
                    </section>
                </article>
            </main >)
    } else {
        const chapter = response.content;
        const source = response.source;

        const title = `${source.title} - Chapter ${chapter.id} : ${chapter.title}`;
        const description = `Read ${source.title} Chapter ${chapter.id} : ${chapter.title} Online For Free [${source.novel.language}]`
        const imageUrl = source.cover;
        const imageAlt = title + " cover";
        const imageType = "image/bmp"



        return (<main role="main">
            <Metadata description={description} title={title} imageUrl={imageUrl} imageAlt={imageAlt} imageType={imageType} />
            <article id="chapter-article" itemScope="" itemType="https://schema.org/CreativeWorkSeries">
                <div className="head-stick-offset"></div>
                <div className="container"></div>
                (<section className="page-in content-wrap" ref={innerRef}>
                    <div className="titles">
                        <h1 itemProp="headline">
                            <Link className="booktitle" to={`/novel/${novelSlug}/${sourceSlug}`} title={source.title} rel="up"
                                itemProp="sameAs">{source.title}</Link>
                            <span hidden=""></span>
                            <br />
                            <span className="chapter-title">{response.title}</span>
                        </h1>
                        <div className="control-action-btn">
                            <button onClick={() => setMenuOpen(!menuOpen)}>
                                <SettingsWheel />
                            </button>
                        </div>

                    </div>
                    <div id="chapter-container" className={"chapter-content " + fontCookie.font} itemProp="description"
                        onClick={() => { window.innerWidth > 768 ? setMenuOpen(false) : setMenuOpen(!menuOpen) }}
                        style={{ "fontSize": fontSizeCookie.fontSize + "px" }} dangerouslySetInnerHTML={{ __html: chapter.body.replaceAll('src="', `src="/api/image/${decodeUrlParameter(novelSlug)}/${decodeUrlParameter(sourceSlug)}/`) }}>
                    </div>
                    <div className="chapternav skiptranslate">
                        <Link rel="prev" className={`button prevchap ${response.is_prev ? "" : 'isDisabled'}`}
                            to={`/novel/${novelSlug}/${sourceSlug}/chapter-${chapter.id - 1}`}>
                            <i className="icon-left-open"></i>
                            <span>Prev</span>
                        </Link>
                        <Link title={source.title} className="button chapindex" to={`/novel/${novelSlug}/${sourceSlug}/chapterlist/page-1`}>
                            <i className="icon-home"></i>
                            <span>Index</span>
                        </Link>
                        <Link rel="next" className={`button nextchap ${response.is_next ? "" : 'isDisabled'}`}
                            to={`/novel/${novelSlug}/${sourceSlug}/chapter-${chapter.id + 1}`}>
                            <span>Next</span>
                            <i className="icon-right-open"></i>
                        </Link>
                    </div>
                    <dialog className="mobile-title-bar" style={{ "display": (window.innerWidth > 768 ? "none" : "block"), "transformOrigin": "top", "transition": "transform 0.25s ease", "transform": menuOpen ? "scaleY(1)" : "scaleY(0)" }}>
                        <div className="bar-body">
                            <i className="bar-nav-back"><svg viewBox="0 0 24 24" fill="none" width="30" height="30">
                                <path d="M6.975 13.3L12 20H9l-6-8 6-8h3l-5.025 6.7H21v2.6H6.975z"></path>
                            </svg></i>
                            <div className="bar-titles">
                                <Link className="booktitle text1row" to={`/novel/${novelSlug}/${sourceSlug}`}
                                    title={chapter.title}>{chapter.title}
                                </Link>
                                <span className="chapter-title">{chapter.title}</span>
                            </div>
                        </div>
                    </dialog>
                    <dialog className="control-action" translate="no" style={{ "display": "block", "transformOrigin": (window.innerWidth > 768 ? "top" : "bottom"), "transition": "transform 0.25s ease", "transform": menuOpen ? "scaleY(1)" : "scaleY(0)" }}>
                        <nav className="action-items">
                            <div className="action-select">
                                <Link rel="prev" className={(response.is_prev ? "" : 'isDisabled ') + "chnav prev"}
                                    to={`/novel/${novelSlug}/${sourceSlug}/chapter-${chapter.id - 1}`}>
                                    <i className="icon-left-open"></i>
                                    <span>Prev</span>
                                </Link>
                                <Link className="chap-index" title="Chapter Index" to={`/novel/${novelSlug}/${sourceSlug}/chapterlist/page-1`}>
                                    <i className="icon-home"></i>
                                </Link>
                                <button className="nightmode_switch" title="Night mode" data-night="0" data-content="Dark Theme" onClick={switchDarkMode}>
                                    <i className="icon-moon"></i>
                                </button>
                                <Link rel="next" className={(response.is_next ? "" : 'isDisabled ') + "chnav next"}
                                    to={`/novel/${novelSlug}/${sourceSlug}/chapter-${chapter.id + 1}`}>
                                    <span>Next</span>
                                    <i className="icon-right-open"></i>
                                </Link>
                            </div>
                            <div className="font-select">
                                <div className="font-wrap">
                                    <input type="radio" id="radioDefault" name="radioFont" defaultValue="default" defaultChecked="" onClick={() => { setFont("font_default") }} />
                                    <label htmlFor="radioDefault">Default</label>
                                    <input type="radio" id="radioDyslexic" name="radioFont" defaultValue="dyslexic" onClick={() => { setFont("font_dyslexic") }} />
                                    <label htmlFor="radioDyslexic">Dyslexic</label>
                                    <input type="radio" id="radioRoboto" name="radioFont" defaultValue="roboto" onClick={() => { setFont("font_roboto") }} />
                                    <label htmlFor="radioRoboto">Roboto</label>
                                    <input type="radio" id="radioLora" name="radioFont" defaultValue="lora" onClick={() => { setFont("font_lora") }} />
                                    <label htmlFor="radioLora">Lora</label>
                                </div>
                            </div>
                            <div className="action-select range-slider">
                                <div className='font-minus'>
                                    <button className={"svgbtn" + (fontSizeCookie.fontSize === fontSizes[0] ? " isDisabled" : "")} id="svgFontMinus" onClick={() => { setFontSize(fontSizeInt - 2) }} style={{ "backgroundColor": "transparent", "border": "none" }}>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                            <path fillRule="evenodd" clipRule="evenodd"
                                                d="M14.333 21l-1.703-4.6H5.37L3.667 21H1L7.667 3h2.666L17 21h-2.667zM9 6.6l2.74 7.4H6.26L9 6.6zM23 5h-8v2h8V5z"
                                                fill="#000"></path>
                                        </svg>
                                    </button>
                                </div>
                                <div className="range-fontsize">
                                    <div className="range" style={rangeStyle}>
                                        <input type="range" id="fontsize-slider" min={fontSizes[0]} max={fontSizes[fontSizes.length - 1]} step="2" defaultValue={fontSizeCookie.fontSize} onChange={e => { setFontSize(e.target.valueAsNumber) }} />
                                    </div>
                                    <datalist className="range-labels" id="fontStepList">
                                        {fontRangeOption}
                                    </datalist>
                                </div>
                                <div className='font-plus'>
                                    <button className={"svgbtn" + (fontSizeCookie.fontSize === fontSizes[fontSizes.length - 1] ? " isDisabled" : "")} id="svgFontPlus" onClick={() => { setFontSize(fontSizeInt + 2) }} style={{ "backgroundColor": "transparent", "border": "none" }}>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                            <path fillRule="evenodd" clipRule="evenodd"
                                                d="M20 2v3h3v2h-3v3h-2V7h-3V5h3V2h2zm-5.667 19l-1.703-4.6H5.37L3.667 21H1L7.667 3h2.666L17 21h-2.667zM9 6.6l2.74 7.4H6.26L9 6.6z"
                                                fill="#000"></path>
                                        </svg>
                                    </button>
                                </div>
                            </div>


                        </nav>
                    </dialog>

                    <div className="guide-message">
                        <span className="mobile">Tap the screen to use reading tools</span>
                        <span className="desktop">Tip: You can use left and right keyboard keys to browse between
                            chapters.</span>
                    </div>
                </section>)
            </article>
        </main>
        )
    }

}

export default Chapter


// https://stackoverflow.com/a/41581491
function useOuterClick(callback) {
    const callbackRef = useRef(); // initialize mutable ref, which stores callback
    const innerRef = useRef(); // returned to client, who marks "border" element

    // update cb on each render, so second useEffect has access to current value 
    useEffect(() => { callbackRef.current = callback; });

    useEffect(() => {
        document.addEventListener("click", handleClick);
        return () => document.removeEventListener("click", handleClick);
        function handleClick(e) {
            if (innerRef.current && callbackRef.current &&
                !innerRef.current.contains(e.target)
            ) callbackRef.current(e);
        }
    }, []); // no dependencies -> stable click listener

    return innerRef; // convenience for client (doesn't need to init ref himself) 
}