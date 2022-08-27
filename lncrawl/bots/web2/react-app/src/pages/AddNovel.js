import Metadata from '../components/Metadata';
import logo from '../assets/logo.bmp'
import { useState } from 'react';
import "../assets/stylesheets/addnovel.css";

function AddNovel() {

    const description = "Add instantly any novel from more than 140 sources to read for free on LnCrawler! Participate in growing the LnCrawler database for all users!";
    const title = "Add instantly a new novel to LnCrawler database from more than 140 sources!";
    const imageUrl = logo
    const imageAlt = "LnCrawler"
    const imageType = "image/bmp"

    const [jobId] = useState(Math.random().toString().slice(2))
    console.log("jobId: " + jobId)

    let [showAdvanceOptions, setShowAdvanceOptions] = useState(false)

    const [searchQuery, setSearchQuery] = useState("");

    const [novels, setNovels] = useState([]);


    const novelItems = novels.map((novel, index) => {
        console.log(novel, novel.sourcesList)

        let sourceItem = null;
        if (novel.sourcesList !== undefined) {
            console.log("source defined")
            sourceItem = novel.sourcesList.map((source, index) => {
                return (
                    <li className="source-item" key={index}>
                        <i className="download-icon icon-check-empty" onClick={() => startDownload(novel.id, source.id)}></i>
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
            <li className="novel-item" key={index}>
                <i className="icon-right-open" onClick={() => getSourcesFounds(index)}></i>
                <span>{novel.title}</span>
                {sourceItem ? <ul className="source-list">{sourceItem}</ul> : null}
            </li>
        )
    })


    const sleep = ms => new Promise(r => setTimeout(r, ms));


    const [status, setStatus] = useState("");

    async function queue(queueTarget) {
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
                console.log("Unexpected response :" + response);
                finished = true;
            }
        }
        setStatus("finished");

        return response
    }


    async function createSession() {
        // Create a session with query

        fetch(`/api/addnovel/create_session?query=${searchQuery}&job_id=${jobId}`).then(
            response => response.json()
        ).then(
            response => {
                if (response.status === "success") {
                    getNovelsFounds()
                } else {
                    console.log(response);
                }
            }
        )
    }


    async function getNovelsFounds() {
        // Get the novels founds, set Novels
        console.log("chooseNovel");
        let response = await queue(`/api/addnovel/get_novels_founds?job_id=${jobId}`)
        if (response.status === "success") {
            setNovels(response.novels.content)
        } else {
            console.log(response);
        }
    }

    async function getSourcesFounds(novelId) {
        // Get the sources founds, set Sources for the novel
        console.log("chooseSource" + novelId);
        let response = await queue(`/api/addnovel/get_sources_founds?job_id=${jobId}&novel_id=${novelId}`)
        if (response.status === "success") {
            novels[novelId].sourcesList = response.sources.content
            setNovels([...novels])
        } else {
            console.log(response);
        }
    }

    async function startDownload(novelId, sourceId) {
        // Start the download of the novel
        console.log("startDownload" + novelId + " " + sourceId);
        // let response = await queue(`/api/addnovel/start_download?job_id=${job_id}&novel_id=${novelId}&source_id=${sourceId}`)
    }


    return (
        <main role="main">
            <Metadata description={description} title={title} imageUrl={imageUrl} imageAlt={imageAlt} imageType={imageType} />
            <article id="search-section" className="container">
                <div className="search container">
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

                        <input type="number" className="form-control" id="job_id" name="job_id" style={{ display: (showAdvanceOptions) ? "block" : "none" }} defaultValue={jobId} />

                    </form>
                </div>
                <br />
                <br />
                <p>Show advanced settings :
                    <button onClick={() => setShowAdvanceOptions(!showAdvanceOptions)}>o</button>
                </p>
                <p>{status}</p>
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