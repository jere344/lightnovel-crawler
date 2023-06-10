import { useState } from 'react';
import Metadata from '../components/Metadata';

import "../assets/stylesheets/navbar.min.css";
import "../assets/stylesheets/media-mobile.min.css";
import "../assets/stylesheets/media-768.min.css";
import "../assets/stylesheets/media-1024.min.css";
import "../assets/stylesheets/media-1270.min.css";
import "../assets/stylesheets/fontello-embedded.css";
import "../assets/stylesheets/searchpg.min.css";
import { Link } from 'react-router-dom';

import { API_URL } from '../config.js';

function Search() {

    const title = "Read Light Novels Online For Free | LnCrawler";
    const description = "Read world famous Japanese Light Novels, Chinese Light Novels and Korean Light Novels in any language from more that 140 different websites."
    const imageUrl = "WEBSITE_URL + '/static/assets/logo.png'"
    const imageAlt = "LnCrawler"
    const imageType = "image/bmp"


    const [response, setResponse] = useState(
        {
            "status": "",
            "content": [
                // {
                //     "title": "",
                //     "prefered_source": "",
                //     "cover": "",
                //     "chapter_count": "",
                //     "author": "",
                //     "latest": "",
                //     "source_count": "",
                // }
            ]
        }
    );

    const [searchQuery, setSearchQuery] = useState("");

    function searchNovel(e) {
        fetch(`${API_URL}/search/?query=${e}`).then(
            (response) => { return ((response.status === 404) ? undefined : response.json()) }
        ).then(
            data => {
                setResponse(data);
            }
        )
    }

    const novelList = response.content;

    const novelListBase = []
    for (var i = 0; i < novelList.length; i++) {
        novelListBase.push(
            <li className="novel-item" key={novelList[i].title}>
                <Link title={novelList[i].title}
                    to={`/novel/${novelList[i].slug}/${novelList[i].prefered_source}`}>
                    <div className="cover-wrap">
                        <figure className="novel-cover">
                            <img src={`${API_URL}/image/${novelList[i].cover}`} alt={novelList[i].title} />
                        </figure>
                    </div>
                    <div className="item-body">
                        <h4 className="novel-title text1row">{novelList[i].title}</h4>
                        <div className="novel-stats">
                            <span><i className="icon-book-open"></i> {novelList[i].chapter_count} Chapters</span>
                        </div>
                        <div className="novel-stats">
                            <span><i className="icon-crown"></i> {novelList[i].author}</span>
                        </div>
                        <div className="novel-stats">
                            <span><i className="icon-pencil"></i> {novelList[i].latest}</span>
                        </div>
                        <div className="novel-stats">
                            <span><i className="icon-tags"></i> {novelList[i].source_count} Sources</span>
                        </div>
                    </div>
                </Link>
            </li>
        )
    }

    return (
        <main role="main">
            <Metadata description={description} title={title} imageUrl={imageUrl} imageAlt={imageAlt} imageType={imageType} />
            <article className="container" id="search-section">
                <div className="search-container">
                    <form id="novelSearchForm" onSubmit={(e) => { e.preventDefault(); searchNovel(searchQuery) }}>
                        <div className="form-group single">
                            <label className="search_label" onClick={() => searchNovel(searchQuery)}><svg width="16" height="16" viewBox="0 0 16 16"
                                className="styles_icon__3eEqS dib vam pa_auto _no_color">
                                <path
                                    d="M7.153 12.307A5.153 5.153 0 107.153 2a5.153 5.153 0 000 10.307zm5.716-.852l2.838 2.838a1 1 0 01-1.414 1.414l-2.838-2.838a7.153 7.153 0 111.414-1.414z"
                                    fill="#C0C2CC" fillRule="nonzero"></path>
                            </svg></label>
                            <input id="inputContent" name="inputContent" type="search"
                                placeholder="Search Light Novel By Title"
                                value={searchQuery} onInput={e => setSearchQuery(e.target.value)} />
                        </div>
                    </form>
                    <section id="novelListBase">
                        <ul className="novel-list horizontal col2">
                            {novelListBase}
                        </ul>
                    </section>
                </div>
            </article>
        </main >
    )
}

export default Search