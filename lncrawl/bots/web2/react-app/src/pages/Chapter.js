import React, { useEffect, useState, useRef } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom'
import { useCookies } from 'react-cookie';
import { Helmet } from 'react-helmet';

import "../assets/stylesheets/chapterpg.min.css"

import SettingsWheel from '../components/SettingsWheel';
import Metadata from '../components/Metadata';
import CommentComponent from '../components/commentsComponents/CommentComponent';
import notFoundImage from "../assets/404.webp"

import { API_URL } from '../config.js';

import RateSource from '../components/RateSource.js'

function Chapter() {
    const location = useLocation();
    const { currentPreFetchedData } = location.state || {};
    const { novelSlug, sourceSlug, chapterId } = useParams();

    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    useEffect(() => {
        function handleResize() {
            setIsMobile(window.innerWidth < 768);
        }
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    // A placeholder for the chapter data
    var initialResponseValue = {
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
                "language": "en",
                "slug": novelSlug,
            },
            "title": "Loading...",
        }
    }
    const [response, setResponse] = useState(initialResponseValue);
    const [nextPrefetchedData, setNextPrefetchedData] = useState(undefined);

    // When changing route but staying in the same component, the component will not unmount
    // So we need to set the state to the initial value when the route changes
    // renderedWithId will not be updated when we change chapter, so we can use it to detect route change
    const [renderedWithId, setRenderedWithId] = useState(chapterId);
    if (renderedWithId !== chapterId) {
        setRenderedWithId(chapterId);
        setResponse(initialResponseValue);
        setNextPrefetchedData(undefined);

    }

    /* #region Dark mode */

    const [darkModeCookie, setDarkModeCookie] = useCookies(['darkMode']);
    function switchDarkMode() {
        setDarkModeCookie('darkMode', (!(darkModeCookie.darkMode === 'true')).toString(), { path: '/', sameSite: 'strict', maxAge: 2592000 });
    }

    /* #endregion */

    /* #region Font size */

    const fontSizes = ["12", "14", "16", "18", "20", "22", "24", "26", "28"]

    const [fontSizeCookie, setFontSizeCookie] = useCookies(['fontSize']);

    function setFontSize(size) {
        setFontSizeCookie('fontSize', size.toString(), { path: '/', sameSite: 'strict', maxAge: 2592000 });
        const slider = document.getElementById("fontsize-slider")
        if (slider !== null) slider.value = size
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
                </li>
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


    /* #endregion */

    /* #region Setting pannel */

    

    const [menuOpen, setMenuOpen] = useState(false);
    // close fontColorMenuOpen and backgroundColorMenuOpen when menuOpen is closed
    
    const innerRef = useOuterClick(ev => {
        setMenuOpen(false);
    });

    const [fontColorMenuOpen, setFontColorMenuOpen] = useState(false);
    const [backgroundColorMenuOpen, setBackgroundColorMenuOpen] = useState(false);
    useEffect(() => {
        if (!menuOpen) {
            setFontColorMenuOpen(false);
            setBackgroundColorMenuOpen(false);
        }
    }, [menuOpen]);

    /* #endregion */

    /* #region Font family */

    const [fontCookie, setFontCookie] = useCookies(['font']);
    function setFont(font) {
        setFontCookie('font', font, { path: '/', sameSite: 'strict', maxAge: 2592000 });
    }

    if (fontCookie.font === undefined) {
        setFont("font_default");
    }


    /* #endregion */

    /* #region Background color */

    const [backgroundColorCookie, setBackgroundColorCookie] = useCookies(['backgroundColor']);
    
    function isValidColor(color) {
        const s = new Option().style;
        s.color = color;
        return s.color !== '';
      }

    function setBackgroundColor(color) {
        const valid = isValidColor(color);
        if (!valid && isValidColor("#" + color)) {
            color = "#" + color;
        }
        else if (!valid) {
            color = "";
        }
        setBackgroundColorCookie('backgroundColor', color, { path: '/', sameSite: 'strict', maxAge: 2592000 });
    }

    if (backgroundColorCookie.backgroundColor === undefined) {
        setBackgroundColor("");
    }
    
    function getActualBackgroundColor() {
        if (backgroundColorCookie.backgroundColor === "") {
            if (isMobile) {
                return "var(--bg-color-main)";
            }
            else {
                return "var(--bg-color-2)";
            }
        }
        else {
            return backgroundColorCookie.backgroundColor;
        }
    }
    /* #region fix out of bound background color edit dialog */

    // when the window is small, combo-dialog can overflow out of the screen right side
    // 530 -> 50%
    // 453 -> 23%

    // 87 -> 27%

    // 87 / 27 = 3.22

    // left = ((window width - 453) / 3.22)%
    // left = ((window width / 3.22) - 140.6)%
    function fixBackgroundColorDialogPosition() {
        if (!isMobile) return
        
        const windowWidth = window.innerWidth
        if (windowWidth >= 540) return;
        
        const comboDialog = document.getElementsByClassName("combo-dialog")[1];
        if (comboDialog === undefined) return;

        comboDialog.style.left = (((windowWidth / 3.22) - 140.6) + 23) + "%";
    }

    window.addEventListener('resize', fixBackgroundColorDialogPosition);
    fixBackgroundColorDialogPosition();
    

    /* #endregion */

    /* #region font color */

    const [fontColorCookie, setFontColorCookie] = useCookies(['fontColor']);
    function setFontColor(color) {
        const valid = isValidColor(color);
        if (!valid && isValidColor("#" + color)) {
            color = "#" + color;
        }
        else if (!valid) {
            color = "";
        }
        setFontColorCookie('fontColor', color, { path: '/', sameSite: 'strict', maxAge: 2592000 });
    }

    if (fontColorCookie.fontColor === undefined) {
        setFontColor("");
    }

    function getActualFontColor() {
        return (fontColorCookie.fontColor === "") ? "var(--text-color)" : fontColorCookie.fontColor;
    }

    /* #endregion */

    /* #region fetch */


    useEffect(() => {
        // When the user click next too fast sometimes the prefetched data is not the next chapter but the current chapter
        // So we need to check if the prefetched data is the next chapter
        if (currentPreFetchedData !== undefined && currentPreFetchedData.content.id === parseInt(chapterId)) {
            setResponse(currentPreFetchedData);
        }
        else {
            setNextPrefetchedData(undefined); // And if not we need to clear the next prefetched data
            fetch(`${API_URL}/chapter/?novel=${novelSlug}&source=${sourceSlug}&chapter=${chapterId}`).then(
                (response) => { return ((response.status === 404) ? undefined : response.json()) }
            ).then(
                data => {
                    setResponse(data);
                }
            )
        }
    }, [novelSlug, sourceSlug, chapterId, currentPreFetchedData]);

    useEffect(() => {
        if (response !== undefined && response.is_next && nextPrefetchedData === undefined) {
            fetch(`${API_URL}/chapter/?novel=${novelSlug}&source=${sourceSlug}&chapter=${response.content.id + 1}`).then(
                (response) => { return ((response.status === 404) ? undefined : response.json()) }
            ).then(
                data => {
                    setNextPrefetchedData(data);
                }
            )


        }
    }, [response, novelSlug, sourceSlug, nextPrefetchedData]);

    /* #endregion */

    /* #region Display mode */

    const [displayModeCookie, setDisplayModeCookie] = useCookies(['displayMode']);
    function setDisplayMode(mode) {
        setDisplayModeCookie('displayMode', mode, { path: '/', sameSite: 'strict', maxAge: 2592000 });
    }

    if (displayModeCookie.displayMode === undefined) {
        setDisplayMode("classic");
        displayModeCookie.displayMode = "classic";
    }


    useEffect(() => {
        if (!displayModeCookie.displayMode.startsWith("manga")) return;
        // All images inside div class=chapter-content
        let images = document.querySelectorAll(".chapter-content img");
        images.forEach(img => {
            let image = new Image();
            image.src = img.src;
            image.onload = function () {
                img.ondblclick = function () {
                    img.classList.toggle("large");
                }
                if (image.width / image.height > 1) {
                    img.classList.add("large");
                }
            }
        });
    }, [response, displayModeCookie]);

    
    
    /* #endregion */
    const [showRateSource, setShowRateSource] = useState(false);

    useEffect(() => {
        if (Math.random() < 0.01) {
            setShowRateSource(true);
        }
        }, [location.pathname]); // Garrante a rerun when the component isn't unmounted

    /* #endregion */
    

    if (response === undefined) {
        const title = "Chapter not found"
        const description = "This chapter does not exist"
        const imageUrl = notFoundImage;
        const imageAlt = "404 - Not Found"
        const imageType = "image/bmp"
        return (
            <>
                <Metadata description={description} title={title} imageUrl={imageUrl} imageAlt={imageAlt} imageType={imageType} />
                <Helmet>
                    <meta name="robots" content="noindex" />
                    <meta name='errorpage' content='true' />
                    <meta name='errortype' content='404 - Not Found' />
                </Helmet>
                <main role="main">

                    <article id="chapter-article" itemScope="" itemType="https://schema.org/CreativeWorkSeries">
                        <section className="page-in content-wrap" ref={innerRef}>
                            <p>This chapter does not exist</p>
                            <Link to={`/novel/${novelSlug}/${sourceSlug}/chapter-1`}>Chapter 1</Link>
                            <br />
                            <Link to={`/novel/${novelSlug}/${sourceSlug}/chapterlist/page-1`}>Index</Link>
                        </section>
                    </article>
                </main>
            </>
        )
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
            <Helmet>
                <meta name="robots" content="index" />
                <link rel="canonical" href={`/novel/${source.novel.slug}/${sourceSlug}/chapter-${chapter.id}`} />
            </Helmet>
            <article id="chapter-article" itemScope="" itemType="https://schema.org/CreativeWorkSeries">
                <div className="head-stick-offset"></div>
                <div className="container"></div>
                <section className="page-in content-wrap" ref={innerRef} style={{ 
                    backgroundColor : backgroundColorCookie.backgroundColor,
                }} >
                    <div className="titles">
                        <h1 itemProp="headline">
                            <Link className="booktitle" to={`/novel/${source.novel.slug}/${sourceSlug}`} title={source.title} rel="up"
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
                    <div id="chapter-container" className={"chapter-content " + fontCookie.font + " " + displayModeCookie.displayMode} itemProp="description"
                        onClick={() => { isMobile ? setMenuOpen(!menuOpen) : setMenuOpen(false)  }}
                        style={{ 
                            "fontSize": fontSizeCookie.fontSize + "px" ,
                            backgroundColor : backgroundColorCookie.backgroundColor,
                            color : fontColorCookie.fontColor
                        }} 
                        dangerouslySetInnerHTML={{ __html: chapter.body.replaceAll('src="', `src="${API_URL}/image/${decodeUrlParameter(source.novel.slug)}/${decodeUrlParameter(sourceSlug)}/`) }}>
                    </div>
                    {
                        chapter.body.includes("<i>Failed to download chapter body</i>") ?
                            (
                                <p>
                                    It seems like this chapter wasn't properly downloaded. <br />
                                    You can try going to <Link to={`/novel/${source.novel.slug}/${sourceSlug}/`}>the index page</Link> and click on update to attempt a redownload.
                                    <br />
                                    You can also try <Link to="/addnovel">adding this novel again</Link> from a different source
                                    <br />
                                    And if it is not availible, you can still read directly from the <a href={chapter.url}>source website</a>
                                </p>)
                            : null
                    }
                    <div className="chapternav skiptranslate">
                        <Link rel="prev" className={`button prevchap ${response.is_prev ? "" : 'isDisabled'}`}
                            to={`/novel/${source.novel.slug}/${sourceSlug}/chapter-${chapter.id - 1}`}>
                            <i className="icon-left-open"></i>
                            <span>Prev</span>
                        </Link>
                        <Link title={source.title} className="button chapindex" to={`/novel/${source.novel.slug}/${sourceSlug}/chapterlist/page-1`}>
                            <i className="icon-home"></i>
                            <span>Index</span>
                        </Link>
                        <Link rel="next" className={`button nextchap ${response.is_next ? "" : 'isDisabled'}`}
                            to={`/novel/${source.novel.slug}/${sourceSlug}/chapter-${chapter.id + 1}`}
                            state={{ currentPreFetchedData: nextPrefetchedData }}>
                            <span>Next</span>
                            <i className="icon-right-open"></i>
                        </Link>
                    </div>
                    <section id="info">
                        <CommentComponent currentUrl={window.location.pathname} />
                    </section>
                    <dialog className="mobile-title-bar" style={{ "display": (isMobile ? "block" : "none"), "transformOrigin": "top", "transition": "transform 0.25s ease", "transform": menuOpen ? "scaleY(1)" : "scaleY(0)" }}>
                        <div className="bar-body">
                            <i className="bar-nav-back"><svg viewBox="0 0 24 24" fill="none" width="30" height="30">
                                <path d="M6.975 13.3L12 20H9l-6-8 6-8h3l-5.025 6.7H21v2.6H6.975z"></path>
                            </svg></i>
                            <div className="bar-titles">
                                <Link className="booktitle text1row" to={`/novel/${source.novel.slug}/${sourceSlug}`}
                                    title={source.title}>{source.title}
                                </Link>
                                <span className="chapter-title">{chapter.title}</span>
                            </div>
                        </div>
                    </dialog>
                    <dialog className="control-action" translate="no" style={{ "display": "block", "transformOrigin": (isMobile ?  "bottom" : "top"), "transition": "transform 0.25s ease", "transform": menuOpen ? "scaleY(1)" : "scaleY(0)" }}>
                        <nav className="action-items">
                            <div className="action-select">
                                <Link rel="prev" className={(response.is_prev ? "" : 'isDisabled ') + "chnav prev"}
                                    to={`/novel/${source.novel.slug}/${sourceSlug}/chapter-${chapter.id - 1}`}>
                                    <i className="icon-left-open"></i>
                                    <span>Prev</span>
                                </Link>
                                <Link className="chap-index" title="Chapter Index" to={`/novel/${source.novel.slug}/${sourceSlug}/chapterlist/page-1`}>
                                    <i className="icon-home"></i>
                                </Link>
                                <button className="nightmode_switch" title="Night mode" data-night="0" data-content="Dark Theme" onClick={switchDarkMode}>
                                    <i className="icon-moon"></i>
                                </button>
                                <Link rel="next" className={(response.is_next ? "" : 'isDisabled ') + "chnav next"}
                                    to={`/novel/${source.novel.slug}/${sourceSlug}/chapter-${chapter.id + 1}`}
                                    state={{ currentPreFetchedData: nextPrefetchedData }}>
                                    <span>Next</span>
                                    <i className="icon-right-open"></i>
                                </Link>
                            </div>
                            <div className="option-select">
                                <div className="option-wrap">
                                    <input type="radio" id="radioDefault" name="radioFont" defaultValue="default" defaultChecked={fontCookie.font === "font_default" ? true : false} onClick={() => { setFont("font_default") }} />
                                    <label htmlFor="radioDefault">Default</label>
                                    <input type="radio" id="radioDyslexic" name="radioFont" defaultValue="dyslexic" defaultChecked={fontCookie.font === "font_dyslexic" ? true : false} onClick={() => { setFont("font_dyslexic") }} />
                                    <label htmlFor="radioDyslexic">Dyslexic</label>
                                    <input type="radio" id="radioRoboto" name="radioFont" defaultValue="roboto" defaultChecked={fontCookie.font === "font_roboto" ? true : false} onClick={() => { setFont("font_roboto") }} />
                                    <label htmlFor="radioRoboto">Roboto</label>
                                    <input type="radio" id="radioLora" name="radioFont" defaultValue="lora" defaultChecked={fontCookie.font === "font_lora" ? true : false} onClick={() => { setFont("font_lora") }} />
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
                            <div className="option-select">
                                <div className="option-wrap">
                                    <input type="radio" id="radioManga" name="radioMode" defaultValue="manga" defaultChecked={displayModeCookie.displayMode === "manga" ? true : false} onClick={() => { setDisplayMode("manga") }} />
                                    <label htmlFor="radioManga">Manga</label>
                                    <input type="radio" id="radioMangaReversed" name="radioMode" defaultValue="manga reversed" defaultChecked={displayModeCookie.displayMode === "manga reversed" ? true : false} onClick={() => { setDisplayMode("manga reversed") }} />
                                    <label htmlFor="radioMangaReversed">Manga Reversed</label>
                                    <input type="radio" id="radioClassic" name="radioMode" defaultValue="classic" defaultChecked={displayModeCookie.displayMode === "classic" ? true : false} onClick={() => { setDisplayMode("classic") }} />
                                    <label htmlFor="radioClassic">Classic</label>
                                    <input type="radio" id="radioWebtoon" name="radioMode" defaultValue="webtoon" defaultChecked={displayModeCookie.displayMode === "webtoon" ? true : false} onClick={() => { setDisplayMode("webtoon") }} />
                                    <label htmlFor="radioWebtoon">Webtoon</label>
                                </div>
                            </div>
                            <div className="option-select">
                                <div className="combo-wrap">
                                    <label>Font color : </label>
                                    <div className="combo-select">
                                        <button onClick={() => { setFontColorMenuOpen(!fontColorMenuOpen) }}>
                                            <span className="color-swatch" 
                                                style={{
                                                    "backgroundColor":getActualFontColor()
                                                }}>
                                            </span>
                                        </button>
                                        <div className="combo-dialog left" style={{ 
                                            transform: fontColorMenuOpen ? "scaleY(1) translateX(-50%)" : "scaleY(0) translateX(-50%)",
                                        }}>
                                            <div className="color-button" style={{ "backgroundColor": "var(--text-color)" }} onClick={() => { setFontColor("") }}></div>
                                            <div className="color-button" style={{ "backgroundColor": "#000000" }} onClick={() => { setFontColor("#000000") }}></div>
                                            <div className="color-button" style={{ "backgroundColor": "#333333" }} onClick={() => { setFontColor("#333333") }}></div>
                                            <div className="color-button" style={{ "backgroundColor": "#666666" }} onClick={() => { setFontColor("#666666") }}></div>
                                            <div className="color-button" style={{ "backgroundColor": "#777777" }} onClick={() => { setFontColor("#777777") }}></div>
                                            <div className="color-button" style={{ "backgroundColor": "#CCCCCC" }} onClick={() => { setFontColor("#CCCCCC") }}></div>
                                            <div className="color-button" style={{ "backgroundColor": "#FFFFFF" }} onClick={() => { setFontColor("#FFFFFF") }}></div>
                                            <div className="color-button" style={{ "backgroundColor": "#F0F0F0" }} onClick={() => { setFontColor("#F0F0F0") }}></div>
                                            <div className="color-button" style={{ "backgroundColor": "#CCCCCC" }} onClick={() => { setFontColor("#CCCCCC") }}></div>
                                            <div className="color-button" style={{ "backgroundColor": "#E5E5E5" }} onClick={() => { setFontColor("#E5E5E5") }}></div>
                                            <div className="color-button" style={{ "backgroundColor": "#DDDDDD" }} onClick={() => { setFontColor("#DDDDDD") }}></div>
                                            <div className="color-button" style={{ "backgroundColor": "#FAFAFA" }} onClick={() => { setFontColor("#FAFAFA") }}></div>
                                            <input type="text" id="custom-hex-input" placeholder="#ffffff" onKeyDown={(event) => { if (event.key === 'Enter') { setFontColor(document.getElementById("custom-hex-input").value) } }} />
                                            
                                            <span className="background"></span>
                                        </div>
                                    </div>
                                    
                                    <label>Background color : </label>
                                    <div className="combo-select" style={{marginRight: "0px"}}>
                                        <button onClick={() => { setBackgroundColorMenuOpen(!backgroundColorMenuOpen) }}>
                                        
                                            <span className="color-swatch" 
                                                style={{
                                                "backgroundColor":getActualBackgroundColor()
                                            }}>
                                            </span>
                                        </button>
                                        <div className="combo-dialog" style={{ 
                                            transform: backgroundColorMenuOpen ? "scaleY(1) translateX(-50%)" : "scaleY(0) translateX(-50%)",
                                        }}>
                                            <div className="color-button" style={{ "backgroundColor": "var(--bg-color-main)" }} onClick={() => { setBackgroundColor("") }}></div>
                                            <div className="color-button" style={{ "backgroundColor": "#000000" }} onClick={() => { setBackgroundColor("#000000") }}></div>
                                            <div className="color-button" style={{ "backgroundColor": "#333333" }} onClick={() => { setBackgroundColor("#333333") }}></div>
                                            <div className="color-button" style={{ "backgroundColor": "#666666" }} onClick={() => { setBackgroundColor("#666666") }}></div>
                                            <div className="color-button" style={{ "backgroundColor": "#777777" }} onClick={() => { setBackgroundColor("#777777") }}></div>
                                            <div className="color-button" style={{ "backgroundColor": "#CCCCCC" }} onClick={() => { setBackgroundColor("#CCCCCC") }}></div>
                                            <div className="color-button" style={{ "backgroundColor": "#FFFFFF" }} onClick={() => { setBackgroundColor("#FFFFFF") }}></div>
                                            <div className="color-button" style={{ "backgroundColor": "#F0F0F0" }} onClick={() => { setBackgroundColor("#F0F0F0") }}></div>
                                            <div className="color-button" style={{ "backgroundColor": "#CCCCCC" }} onClick={() => { setBackgroundColor("#CCCCCC") }}></div>
                                            <div className="color-button" style={{ "backgroundColor": "#E5E5E5" }} onClick={() => { setBackgroundColor("#E5E5E5") }}></div>
                                            <div className="color-button" style={{ "backgroundColor": "#DDDDDD" }} onClick={() => { setBackgroundColor("#DDDDDD") }}></div>
                                            <div className="color-button" style={{ "backgroundColor": "#FAFAFA" }} onClick={() => { setBackgroundColor("#FAFAFA") }}></div>
                                            <input type="text" id="custom-hex-input" placeholder="#ffffff" onKeyDown={(event) => { if (event.key === 'Enter') { setBackgroundColor(document.getElementById("custom-hex-input").value) } }} />
                                        
                                            <span className="background"></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </nav>
                    </dialog>


                    <div className="guide-message">
                        <span className="mobile">Tap the screen to use reading tools</span>
                        <span className="desktop">Tip: You can use left and right keyboard keys to browse between
                            chapters.</span>
                    </div>
                </section>
                <section className="rate-source">
                    {showRateSource ? <RateSource novelSlug={novelSlug} sourceSlug={sourceSlug} /> : null}
                </section>
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

