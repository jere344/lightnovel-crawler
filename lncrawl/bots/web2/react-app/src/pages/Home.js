import Metadata from '../components/Metadata';
import logo from '../assets/logo.bmp'
import banner from '../assets/banner.jpg'
import { useState, useEffect } from 'react';
import NovelList from '../components/NovelList';

import "../assets/stylesheets/fontello-embedded.css"
import "../assets/stylesheets/navbar.min.css"
import "../assets/stylesheets/media-mobile.min.css"
import "../assets/stylesheets/media-768.min.css"
import "../assets/stylesheets/media-1024.min.css"
import "../assets/stylesheets/media-1270.min.css"

function Home() {

    const title = "Read Light Novels Online For Free | LnCrawler";
    const description = "Read world famous Japanese Light Novels, Chinese Light Novels and Korean Light Novels in any language from more that 140 different websites."
    const imageUrl = logo
    const imageAlt = "LnCrawler"
    const imageType = "image/bmp"


    const [novels, setNovels] = useState({});
    const sort = 'rank';
    const page = 1;
    useEffect(() => {
        fetch(`/api/novels?page=${parseInt(page) - 1}&sort=${sort}`).then(
            response => response.json()
        ).then(
            data => {
                setNovels(data);
            }
        )
    }, [page, sort]);



    return (
        <main role="main">
            <Metadata description={description} title={title} imageUrl={imageUrl} imageAlt={imageAlt} imageType={imageType} />
            <article id="index">
                <header id="index-head" className="container">
                    <div className="background" style={{ backgroundImage: banner }}></div>
                    <div className="head-content">
                        <h1>Read Light Novel &amp; Web Novel Translations Online For FREE!</h1>
                        <h2><i>Your fictional stories hub</i></h2>
                        <div className="description">
                            <p>Looking for a great place to read Light Novels?</p>
                            <p>Light Novel World is a very special platform where you can read the translated versions of world famous Japanese, Chinese and Korean light novels in English. Every new chapters published by the author is updated instantly on the Light Novel World and notification service is provided to the readers.</p>
                            <p>Start reading now to explore this mysterious fantasy world.</p>
                        </div>
                    </div>
                </header>
                <section className="container vspace">
                    <div className="section-header">
                        <h3>New Ongoing Release</h3>
                        <a className="getmorebtn" title="Most recently added light novels" href="/stories/genre-all/order-new/status-all/p-1">View More</a>
                    </div>
                    <div className="section-body" id="new-novel-section">
                        {(typeof novels.content === 'undefined') ? (
                            <div>Loading...</div>
                        ) : (<NovelList novels={novels.content} type="card" className="novel-list" />)
                        }
                    </div>
                </section>
                <section className="container vspace">
                    <div className="section-header">
                        <h3>Ranking</h3>
                        <a className="getmorebtn" title="Top Rated Light Novels" href="/ranking">View More</a>
                    </div>
                    <div className="section-body" id="popular-novel-section">
                        <div className="index-rank">
                            <input type="radio" name="ranktabs" defaultChecked="" id="tab_most_read" />
                            <label htmlFor="tab_most_read">Most Read</label>
                            <input type="radio" name="ranktabs" id="tab_new_trends" />
                            <label htmlFor="tab_new_trends">New Trends</label>
                            <input type="radio" name="ranktabs" id="tab_user_rated" />
                            <label htmlFor="tab_user_rated">User Rated</label>
                            <div className="rank-container">
                                <h3><span>Most Read</span></h3>
                                {(typeof novels.content === 'undefined') ? (
                                    <div>Loading...</div>
                                ) : (<NovelList novels={novels.content} type="compact-clicks" />)
                                }
                            </div>
                            <div className="rank-container">
                                <h3><span>New Trends</span></h3>
                                {(typeof novels.content === 'undefined') ? (
                                    <div>Loading...</div>
                                ) : (<NovelList novels={novels.content} type="compact-trends" />)
                                }

                            </div>
                            <div className="rank-container">
                                <h3><span>User Rated</span></h3>
                                {(typeof novels.content === 'undefined') ? (
                                    <div>Loading...</div>
                                ) : (<NovelList novels={novels.content} type="compact-rating" />)
                                }

                            </div>
                        </div>
                    </div>
                </section>
                <section className="container vspace">
                    <div className="section-header">
                        <h3>Weekly Most Active</h3>
                    </div>
                    <div className="section-body">
                        {(typeof novels.content === 'undefined') ? (
                            <div>Loading...</div>
                        ) : (<NovelList novels={novels.content} type="card" className="novel-list" />)
                        }
                    </div>
                </section>
                <section className="container vspace">
                    <header className="section-header">
                        <h3>Recently Added Chapters</h3>
                        <a className="getmorebtn mr" title="Recently Added Chapters Novels Chapters" href="/latest-updates">View More</a>
                    </header>
                    <div className="section-body">
                        {(typeof novels.content === 'undefined') ? (
                            <div>Loading...</div>
                        ) : (<NovelList novels={novels.content} type="chapter" className="novel-list horizontal col3" />)
                        }
                    </div>
                </section>
            </article>
        </main >
    )
}

export default Home