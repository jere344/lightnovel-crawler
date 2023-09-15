import logo from '../assets/logo.png'
import Helmet from 'react-helmet';
import { useCookies } from 'react-cookie';
import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Header() {
    const navigate = useNavigate();

    const [darkModeCookie, setDarkModeCookie] = useCookies(['darkMode']);

    function switchDarkMode() {
        setDarkModeCookie('darkMode', (!(darkModeCookie.darkMode === 'true')).toString(), { path: '/', sameSite: 'strict', maxAge: 2592000 });
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
                            <img src={logo} alt="Light Novel" width="110" height="70" />
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
                                    <a className="nav-link" title="Development"
                                        href="https://github.com/jere344/lightnovel-crawler/tree/react-dev-dev"><i
                                            className="icon-megaphone"></i> DEV</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" title="Discord" href="https://discord.gg/a2b4Mfr4cU" target="_blank" rel="noreferrer"> 
                                        <i class="icon-discord">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
                                                <path d="M524.531,69.836a1.5,1.5,0,0,0-.764-.7A485.065,485.065,0,0,0,404.081,32.03a1.816,1.816,0,0,0-1.923.91,337.461,337.461,0,0,0-14.9,30.6,447.848,447.848,0,0,0-134.426,0,309.541,309.541,0,0,0-15.135-30.6,1.89,1.89,0,0,0-1.924-.91A483.689,483.689,0,0,0,116.085,69.137a1.712,1.712,0,0,0-.788.676C39.068,183.651,18.186,294.69,28.43,404.354a2.016,2.016,0,0,0,.765,1.375A487.666,487.666,0,0,0,176.02,479.918a1.9,1.9,0,0,0,2.063-.676A348.2,348.2,0,0,0,208.12,430.4a1.86,1.86,0,0,0-1.019-2.588,321.173,321.173,0,0,1-45.868-21.853,1.885,1.885,0,0,1-.185-3.126c3.082-2.309,6.166-4.711,9.109-7.137a1.819,1.819,0,0,1,1.9-.256c96.229,43.917,200.41,43.917,295.5,0a1.812,1.812,0,0,1,1.924.233c2.944,2.426,6.027,4.851,9.132,7.16a1.884,1.884,0,0,1-.162,3.126,301.407,301.407,0,0,1-45.89,21.83,1.875,1.875,0,0,0-1,2.611,391.055,391.055,0,0,0,30.014,48.815,1.864,1.864,0,0,0,2.063.7A486.048,486.048,0,0,0,610.7,405.729a1.882,1.882,0,0,0,.765-1.352C623.729,277.594,590.933,167.465,524.531,69.836ZM222.491,337.58c-28.972,0-52.844-26.587-52.844-59.239S193.056,219.1,222.491,219.1c29.665,0,53.306,26.82,52.843,59.239C275.334,310.993,251.924,337.58,222.491,337.58Zm195.38,0c-28.971,0-52.843-26.587-52.843-59.239S388.437,219.1,417.871,219.1c29.667,0,53.307,26.82,52.844,59.239C470.715,310.993,447.538,337.58,417.871,337.58Z"/>
                                            </svg>
                                        </i>
                                        &nbsp;Discord
                                    </a>
                                </li>

                                <li className="nav-item">
                                    <Link className="nav-link" title="Add Novel" to="/addnovel"><i
                                        className="icon-plus-circled"></i> Add Novel</Link>
                                </li>
                                <li className="nav-item">
                                    <button className="nightmode_switch" data-tool="nightmode_switch" title="Dark Mode" data-night="0"
                                        data-content="Dark Theme" onClick={switchDarkMode}>

                                        <i className={"icon-" + (darkModeCookie.darkMode === 'true' ? "moon" : "sun")}></i>
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                    <div className="nav-back">
                        <button className="nav-back-button" data-tool="nav-back-button" title="Back" data-content="Back" onClick={() => navigate(-1)}>
                             <i className="icon-left-open"></i>
                        </button>
                        
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