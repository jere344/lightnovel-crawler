import logo from '../assets/logo.bmp'
import Helmet from 'react-helmet';
import { useCookies } from 'react-cookie';
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

function Header() {

    const [darkModeCookie, setDarkModeCookie] = useCookies(['darkMode']);

    function switchDarkMode() {
        setDarkModeCookie('darkMode', (!(darkModeCookie.darkMode === 'true')).toString(), { path: '/', sameSite: 'strict' });
    }

    const [pannelOpen, setPannelOpen] = useState(false);


    const innerRef = useOuterClick(ev => {
        setPannelOpen(false);
    });


    return (
        <div className="header">
            <header className="main-header skiptranslate" ref={innerRef}>
                <Helmet>
                    <html lang="en" xmlns="http://www.w3.org/1999/xhtml"
                        theme={darkModeCookie.darkMode === 'true' ? "dark" : "light"}
                        bgcolor={darkModeCookie.darkMode === 'true' ? "black" : "white"}
                        hgcolor="purple"
                        style={pannelOpen ? "border-right: medium none;" : ""}
                        className={"vynzkfajee idc0_341" + (pannelOpen ? " ovh" : "")}></html>
                    <link rel="stylesheet" as="style"
                        href="https://fonts.googleapis.com/css?family=Roboto:400,500,600,700|Nunito+Sans:400,500,600,700&amp;display=swap"
                        crossorigin="" onload="this.rel='stylesheet'" />
                    <body className={"fade-out vsc-initialized ovh" + (pannelOpen ? " navigation" : "")} />
                </Helmet>

                <div className="wrapper">
                    <div className="nav-logo">
                        <Link to="/" title="Read Most Popular Light Novels Online for Fre">
                            <img src={logo} alt="Light Novel" />
                        </Link>
                    </div>
                    <div className="navigation-bar" ref={innerRef}>
                        <nav>
                            <span className="lnw-slog">Your fictional stories hub.</span>
                            <ul className="navbar-menu">
                                <li className="nav-item">
                                    <Link className="nav-link" title="Search Light Novels" to="/search"><i
                                        className="icon-search"></i> Search</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" title="Explore the Most Popular Light Novels" to="/browse/page-1"><i
                                        className="icon-th-large"></i> Browse</Link>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" title="Development Announcements"
                                        href="https://github.com/dipu-bd/lightnovel-crawler/tree/dev"><i
                                            className="icon-megaphone"></i> DEV</a>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" title="Add Novel" to="/lncrawl/addnovel/search/"><i className="plus"></i>Add
                                        Novel</Link>
                                </li>
                                <li className="nav-item">
                                    <button className="nightmode_switch" data-tool="nightmode_switch" title="Dark Mode" data-night="0"
                                        data-content="Dark Theme" onClick={switchDarkMode}>

                                        <i className="icon-moon"></i>
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                    <div className="nav-back">
                        <i className="icon-left-open"></i>
                    </div>
                    <button id="mobile-menu-btn" onClick={() => setPannelOpen(!pannelOpen)}>
                        <div id="burger-btn"></div>
                    </button>
                </div>
            </header>
            <div className={"sidebar-wrapper" + (pannelOpen ? " show" : "")} style={{ "top": "94px" }}></div>
        </div>

    )
}

export default Header




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