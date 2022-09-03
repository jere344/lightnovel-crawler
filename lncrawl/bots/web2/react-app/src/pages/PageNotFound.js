import Metadata from '../components/Metadata';
import logo from '../assets/logo.bmp'
import { Link } from 'react-router-dom';


import "../assets/stylesheets/pagenotfound.css"
import "../assets/stylesheets/navbar.min.css"
import "../assets/stylesheets/media-mobile.min.css"
import "../assets/stylesheets/media-768.min.css"
import "../assets/stylesheets/media-1024.min.css"
import "../assets/stylesheets/media-1270.min.css"
import "../assets/stylesheets/fontello.css"


function PageNotFound() {

    const title = "Read Light Novels Online For Free | LnCrawler";
    const description = "Read world famous Japanese Light Novels, Chinese Light Novels and Korean Light Novels in any language from more that 140 different websites."
    const imageUrl = logo
    const imageAlt = "LnCrawler"
    const imageType = "image/bmp"



    return (
        <main role="main">
            <Metadata description={description} title={title} imageUrl={imageUrl} imageAlt={imageAlt} imageType={imageType} />
            <article id="page-not-found" className="container">
                <main role="main">
                    <style>

                    </style>
                    <div className="container">
                        <div className="white-boxed">
                            <h1>Page Not Found</h1>
                            <p>We can't seem to find the page you're looking for.</p>
                            <p>Some novel pages moved for better user experience. Could be affected by this situation.</p>
                            <p>Please use the search function for the content you want to access or go to home page and start exploring the light novels.</p>
                            <hr />
                            <div className="mt-2">
                                <Link className="button" to="/search" role="button">Start Search</Link>
                                <Link className="button" to="/" role="button">Go Homepage</Link>
                            </div>
                        </div>
                    </div>
                </main>
            </article >
        </main >
    )
}

export default PageNotFound