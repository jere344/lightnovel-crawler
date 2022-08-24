import Metadata from '../components/Metadata';
import logo from '../assets/logo.bmp'
import { useState } from 'react';

function AddNovel() {

    const description = "Add instantly any novel from more than 140 sources to read for free on LnCrawler! Participate in growing the LnCrawler database for all users!";
    const title = "Add instantly a new novel to LnCrawler database from more than 140 sources!";
    const imageUrl = logo
    const imageAlt = "LnCrawler"
    const imageType = "image/bmp"

    const job_id = Math.random().toString().slice(2)

    let [showAdvanceOptions, setShowAdvanceOptions] = useState(false)

    const [searchQuery, setSearchQuery] = useState("");
    console.log(searchQuery);

    return (
        <main role="main">
            <Metadata description={description} title={title} imageUrl={imageUrl} imageAlt={imageAlt} imageType={imageType} />
            <article id="search-section" className="container">
                <div className="search container">
                    <form id="novelSearchForm" onSubmit={(e) => { e.preventDefault(); sendSearchRequest() }}>
                        <div className="form-group single">
                            <button type="button" onClick={() => sendSearchRequest()} className="search_label"
                                style={{ border: "0px", background: "none" }}>
                                <svg width="16" height="16" viewBox="0 0 16 16"
                                    className="styles_icon__3eEqS dib vam pa_auto _no_color">
                                    <path
                                        d="M7.153 12.307A5.153 5.153 0 107.153 2a5.153 5.153 0 000 10.307zm5.716-.852l2.838 2.838a1 1 0 01-1.414 1.414l-2.838-2.838a7.153 7.153 0 111.414-1.414z"
                                        fill="#C0C2CC" fillRule="nonzero"></path>
                                </svg>
                            </button>
                            <input id="inputContent" name="inputContent" type="search" className="form-control"
                                placeholder="Search Light Novel By Title" aria-label="Novel Search"
                                aria-describedby="basic-addon1"
                                value={searchQuery} onInput={e => setSearchQuery(e.target.value)} />
                            <input type="submit" hidden />
                        </div>

                        <input type="number" className="form-control" id="job_id" name="job_id" style={{ display: (showAdvanceOptions) ? "block" : "none" }} defaultValue={job_id} />

                    </form>
                </div>
                <br />
                <br />
                <p>Show advanced settings :
                    <button onClick={() => setShowAdvanceOptions(!showAdvanceOptions)}>o</button>
                </p>

                <section id="novelListBase"></section>
            </article>
        </main >
    )

    function sendSearchRequest() {
        console.log("sendSearchRequest" + searchQuery);
    }
}

export default AddNovel