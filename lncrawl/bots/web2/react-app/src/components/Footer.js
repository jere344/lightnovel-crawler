import React from 'react'
import logo from '../assets/logo.png'

function Footer() {
    return (
        <footer translate="no">
            <div className="wrapper">
                <div className="col logo">
                    <a href="/" style={{ "display": "inline-block" }}>
                        <img className="footer-logo" src={logo} alt="logo-footer" />
                    </a>
                </div>
                <nav className="col links">
                    <ul>
                        <li>
                            <a href="https://github.com/dipu-bd/lightnovel-crawler/tree/dev">Terms of Service</a>
                        </li>
                        <li>
                            <a href="https://github.com/dipu-bd/lightnovel-crawler/tree/dev">DMCA Notices</a>
                        </li>
                        <li>
                            <a href="https://github.com/dipu-bd/lightnovel-crawler/tree/dev">Contact Us</a>
                        </li>
                    </ul>
                </nav>
            </div>
        </footer>
    )
}

export default Footer