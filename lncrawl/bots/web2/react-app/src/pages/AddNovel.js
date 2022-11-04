import Metadata from '../components/Metadata';
import logo from '../assets/logo.bmp'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../assets/stylesheets/addnovel.css";
import "../assets/stylesheets/switch.css"
function AddNovel() {

    const description = "Add instantly any novel from more than 140 sources to read for free on LnCrawler! Participate in growing the LnCrawler database for all users!";
    const title = "Add instantly a new novel to LnCrawler database from more than 140 sources!";
    const imageUrl = logo
    const imageAlt = "LnCrawler"
    const imageType = "image/bmp"

    let navigate = useNavigate();
    const sleep = ms => new Promise(r => setTimeout(r, ms));

    let [showAdvanceOptions, setShowAdvanceOptions] = useState(false);
    const [showRetryButton, setShowRetryButton] = useState(false);

    const [jobId] = useState(Math.random().toString().slice(2));
    const [searchQuery, setSearchQuery] = useState("");


    const [novels, setNovels] = useState([]);
    const [selectedNovel, setSelectedNovel] = useState(null);
    const novelItems = novels.map((novel, novelIndex) => {
        // If the source list for the novel is empty, ask it to the server, add it the the list and select it
        // if not empty, just select it

        let sourceItem = null;
        if ((novel.sourcesList !== undefined) && (novelIndex === selectedNovel)) {
            sourceItem = novel.sourcesList.map((source, sourceIndex) => {
                return (
                    <li className="source-item" key={sourceIndex}>
                        <i className="download-icon icon-check-empty" onClick={() => startDownload(novelIndex, sourceIndex)}></i>
                        <div>
                            <a className="source-url" href={source.url}>{source.url}</a>
                            {source.info ? <label>{source.info}</label> : null}
                        </div>
                    </li>
                )
            }
            )
        }

        return (
            <li className="novel-item" key={novelIndex}>
                <i className="icon-right-open" onClick={() => getSourcesFounds(novelIndex)}></i>
                <span>{novel.title}</span>
                {sourceItem ? <ul className="source-list">{sourceItem}</ul> : null}
            </li>
        )
    })

    const [sessionCreated, setSessionCreated] = useState(false);
    const [status, setStatus] = useState("");

    async function queue(queueTarget) {
        // polling system => if the job is not finished yet, we wait for 1 second and we poll again
        let response = false;
        let finished = false;
        while (!finished) {
            response = await fetch(queueTarget).then(res => res.json());

            if (response.status === "success") {
                finished = true;
            } else if (response.status === "pending") {
                setStatus(response.message)
                await sleep(3000); // wait 3 seconds and try again
            } else if (response.status === "error") {
                finished = true;
                setStatus(response.message)
            } else {
                console.log("Unexpected response :", response);
                finished = true;
            }
        }

        return response
    }


    async function createSession() {
        // Create a session with query
        setSessionCreated(true);

        var query = searchQuery.trim();

        if (query.length < 3) {
            setStatus("Search query must be at least 3 characters long");
            return;
        }

        if (query.startsWith("http")) {
            console.log("Search query is an url");
            directDownload(searchQuery);
            return;
        }

        fetch(`/api/addnovel/create_session?query=${query}&job_id=${jobId}`).then(
            response => response.json()
        ).then(
            response => {
                if (response.status === "success") {
                    getNovelsFounds()
                } else if (response.message !== undefined) {
                    console.log("Error creating session : " + response.message)
                } else {
                    console.log("Unexpected response :", response);
                }
            }
        )
    }


    async function getNovelsFounds() {
        let response = await queue(`/api/addnovel/get_novels_founds?job_id=${jobId}`)
        if (response.status === "success") {
            setStatus("");
            setNovels(response.novels.content);
        }
    }

    async function getSourcesFounds(novelId) {
        if (novelId.sourcesList === undefined) {
            let response = await queue(`/api/addnovel/get_sources_founds?job_id=${jobId}&novel_id=${novelId}`)
            if (response.status === "success") {
                novels[novelId].sourcesList = response.sources.content
                setNovels([...novels]) // [...val] update the state directly
            }
        }

        if (selectedNovel === novelId) {
            setSelectedNovel(null)
        } else {
            setSelectedNovel(novelId);
        }

    }

    async function startDownload(novelId, sourceId) {
        setNovels([]);
        let response = await queue(`/api/addnovel/download?job_id=${jobId}&novel_id=${novelId}&source_id=${sourceId}`);
        if (response.status === "success") {
            navigate(`/novel/${response.url}`);
        } else if (response.status === "error") {
            setStatus(response.message)
            setShowRetryButton(true);
        }

    }

    async function directDownload(url) {
        let response = await queue(`/api/addnovel/direct_download?job_id=${jobId}&url=${url}`);
        if (response.status === "success") {
            navigate(`/novel/${response.url}`);
        }
    }

    async function retry(){
        setShowRetryButton(false)
        setNovels([]);
        

        let response = await fetch("/api/addnovel/load_snapshot?job_id=" + jobId).then(res => res.json());

        if (response.status === "success") {
            getNovelsFounds()
        } else if (response.message !== undefined) {
            console.log("Error retrying : " + response.message)
        } else {
            console.log("Unexpected response :",  response);
        }
    }


    return (
        <main role="main">
            <Metadata description={description} title={title} imageUrl={imageUrl} imageAlt={imageAlt} imageType={imageType} />
            <article id="search-section" className="container">
                <div className="search container" style={{ display: sessionCreated ? "none" : "block" }}>
                    <form id="novelSearchForm" onSubmit={(e) => { e.preventDefault(); createSession() }}>
                        <div className="form-group single">
                            <button type="button" onClick={() => createSession()} className="search_label"
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

                        <input type="number" className="form-control" id="job_id" name="job_id" style={{ visibility: (showAdvanceOptions) ? "visible" : "hidden" }} defaultValue={jobId} />

                    </form>
                    <br />
                    <br />
                    <div className="form-group single" style={{ display: "flex", justifyContent: "flex-start" }}>
                        <label className="switch">
                            <input type="checkbox" onClick={() => setShowAdvanceOptions(!showAdvanceOptions)} />
                            <span className="slider round"></span>
                        </label>
                        <p>Show advanced settings</p>
                    </div>

                </div>
                {sessionCreated ? <h1>Search results for {searchQuery}</h1> : null}
                <p>{status}</p>
                {showRetryButton ? <button className="btn btn-primary" onClick={() => retry()}>Retry</button> : null}
                <section id="novelListBase">
                    <ul className="novel-list">
                        {novelItems}
                    </ul>
                </section>
            </article>
        </main >
    )

}

export default AddNovel