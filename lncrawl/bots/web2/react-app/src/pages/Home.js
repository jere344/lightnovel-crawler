import Metadata from '../components/Metadata';
import logo from '../assets/logo.png'
import banner from '../assets/banner.jpg'
import { useState, useEffect } from 'react';
import NovelList from '../components/NovelList';
import { Link } from 'react-router-dom';

import "../assets/stylesheets/fontello-embedded.css"
import "../assets/stylesheets/navbar.min.css"
import "../assets/stylesheets/media-mobile.min.css"
import "../assets/stylesheets/media-768.min.css"
import "../assets/stylesheets/media-1024.min.css"
import "../assets/stylesheets/media-1270.min.css"

function Home() {

    const title = "Read Light Novels Online For Free | LnCrawler";
    const description = "Read world famous Japanese Light Novels, Chinese Light Novels and Korean Light Novels in any language from more that 200 different websites."
    const imageUrl = logo
    const imageAlt = "LnCrawler"
    const imageType = "image/bmp"


    const [novelsSortViews, setNovelsSortViews] = useState({});
    useEffect(() => {
        fetch('/api/novels?page=0&sort=rank&number=12').then(
            response => response.json()
        ).then(
            data => {
                setNovelsSortViews(data);
            }
        )
    }, []);

    const [novelsSortRating, setNovelsSortRating] = useState({});
    useEffect(() => {
        fetch('/api/novels?page=0&sort=rating&number=12').then(
            response => response.json()
        ).then(
            data => {
                setNovelsSortRating(data);
            }
        )
    }, []);

    const [novelsSortWeeklyViews, setNovelsSortWeeklyViews] = useState({});
    useEffect(() => {
        fetch('/api/novels?page=0&sort=weekly_views&number=12').then(
            response => response.json()
        ).then(
            data => {
                setNovelsSortWeeklyViews(data);
            }
        )
    }, []);

    const [novelsSortLastUpdate, setNovelsSortLastUpdate] = useState({});
    useEffect(() => {
        fetch('/api/sources?page=0&sort=last_updated&number=12').then(
            response => response.json()
        ).then(
            data => {
                setNovelsSortLastUpdate(data);
            }
        )
    }, []);

    return (
        <main role="main">
            <Metadata description={description} title={title} imageUrl={imageUrl} imageAlt={imageAlt} imageType={imageType} />
            <article id="index">
                <header id="index-head" className="container">
                    <div className="background" style={{ backgroundImage: `url(${banner})` }}></div>
                    <div className="head-content">
                        <h1>Read Light Novel &amp; Web Novel Translations Online For FREE!</h1>
                        <h2><i>Your fictional stories hub</i></h2>
                        <div className="description">
                            <p>Looking for a great place to read Light Novels?</p>
                            <p>Light Novel Crawler is a very special platform where you can read the translated versions of world famous Japanese, Chinese and Korean light novels from more than 200 differents sources in different languages. If you can't find your novel here, you can instantly and automatically add it to our database from the Add Novel page.</p>
                            <p>Start reading now to explore this mysterious fantasy world.</p>
                        </div>
                    </div>
                </header>
                <section className="container vspace">
                    <div className="section-header">
                        <h3>Best of all time</h3>
                        <Link className="getmorebtn" title="Most recently added light novels" to="/browse/page-1?sort=rank">View More</Link>
                    </div>
                    <div className="section-body" id="new-novel-section">
                        {<NovelList novels={novelsSortViews.content || null} type="card" className="novel-list" />}
                    </div>
                </section>
                <section className="container vspace">
                    <div className="section-header">
                        <h3>Ranking</h3>
                        <Link className="getmorebtn" title="Top Rated Light Novels" to="/browse/page-1">View More</Link>
                    </div>
                    <div className="section-body" id="popular-novel-section">
                        <div className="index-rank">
                            <input type="radio" name="ranktabs" id="tab_most_read" />
                            <label htmlFor="tab_most_read">Most Read</label>
                            <input type="radio" name="ranktabs" id="tab_new_trends" />
                            <label htmlFor="tab_new_trends">New Trends</label>
                            <input type="radio" name="ranktabs" id="tab_user_rated" defaultChecked={true}/>
                            <label htmlFor="tab_user_rated">User Rated</label>
                            <div className="rank-container">
                                <h3><span>Most Read</span></h3>
                                {(<NovelList novels={novelsSortViews.content || null} type="compact-clicks" />) }
                            </div>
                            <div className="rank-container">
                                <h3><span>New Trends</span></h3>
                                {(<NovelList novels={novelsSortWeeklyViews.content || null} type="compact-trends" />)}

                            </div>
                            <div className="rank-container">
                                <h3><span>User Rated</span></h3>
                                {(<NovelList novels={novelsSortRating.content || null} type="compact-rating" />)}
                            </div>
                        </div>
                    </div>
                </section>
                <section className="container vspace">
                    <div className="section-header">
                        <h3>Weekly Most Active</h3>
                        <Link className="getmorebtn" title="Top Rated Light Novels" to="/browse/page-1?sort=weekly_views">View More</Link>
                    </div>
                    <div className="section-body">
                        {(<NovelList novels={novelsSortWeeklyViews.content || null} type="card" className="novel-list" />)}
                    </div>
                </section>
                <section className="container vspace">
                    <header className="section-header">
                        <h3>Recently Added Chapters</h3>
                        <Link className="getmorebtn mr" title="Recently Added Chapters Novels Chapters" to="/browse/page-1?sort=last_updated">View More</Link>
                    </header>
                    <div className="section-body">
                        {(<NovelList novels={novelsSortLastUpdate.content || null} type="chapter" className="novel-list horizontal col3" />)}
                    </div>
                </section>
            </article>
        </main>
    )
}

export default Home