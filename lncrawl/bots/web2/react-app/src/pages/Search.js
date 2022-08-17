import Metadata from '../components/Metadata';

import "../assets/stylesheets/navbar.min.css";
import "../assets/stylesheets/media-mobile.min.css";
import "../assets/stylesheets/media-768.min.css";
import "../assets/stylesheets/media-1024.min.css";
import "../assets/stylesheets/media-1270.min.css";
import "../assets/stylesheets/fontello.css";
import "../assets/stylesheets/searchpg.min.css";


function Search() {

    const title = "Read Light Novels Online For Free | LnCrawler";
    const description = "Read world famous Japanese Light Novels, Chinese Light Novels and Korean Light Novels in any language from more that 140 different websites."
    const imageUrl = "WEBSITE_URL + '/static/assets/logo.bmp'"
    const imageAlt = "LnCrawler"
    const imageType = "image/bmp"


    const [response, setResponse] = useState(
        {
            "content": [
                {

                }
            ]
        }
    );
    const chapter = response.content;
    const source = response.source;

    const { novelSlug, sourceSlug, page } = useParams();
    useEffect(() => {
        fetch(`/api/chapterlist/?novel=${novelSlug}&source=${sourceSlug}&page=${page}`).then(
            response => response.json()
        ).then(
            data => {
                setResponse(data);
                console.log(data);
            }
        )
    }, [novelSlug, sourceSlug, page]);


    novelListBase = []
    for (var i = 0; i < novelList.length; i++) {
        novelListBase.push(<li class="novel-item">
            <a title="{{ novel.title }}"
                href="/lncrawl/novel/{{ novel.slug }}/{{ novel.prefered_source.slug }}">
                <div class="cover-wrap">
                    <figure class="novel-cover">
                        <img src='/image/{{ novel.cover }}' alt="{{ novel.title }}" />
                    </figure>
                </div>
                <div class="item-body">
                    <h4 class="novel-title text1row">{novel.title}</h4>
                    <div class="novel-stats">
                        <span><i class="icon-book-open"></i> {novel.chapter_count} Chapters</span>
                    </div>
                    <div class="novel-stats">
                        <span><i class="icon-crown"></i> {novel.author}</span>
                    </div>
                    <div class="novel-stats">
                        <span><i class="icon-pencil-2"></i> {novel.latest}</span>
                    </div>
                    <div class="novel-stats">
                        <span><i class="icon-tags"></i> {novel.source_count} Sources</span>
                    </div>
                </div>
            </a>
        </li>)

    }

    return (
        <main role="main">
            <Metadata description={description} title={title} imageUrl={imageUrl} imageAlt={imageAlt} imageType={imageType} />
            <article class="container" id="search-section">
                <div class="search-container">
                    <form method="post" id="novelSearchForm" action="/lncrawl/lnsearchlive">
                        <div class="form-group single">
                            <label class="search_label" for="search"><svg width="16" height="16" viewBox="0 0 16 16"
                                class="styles_icon__3eEqS dib vam pa_auto _no_color">
                                <path
                                    d="M7.153 12.307A5.153 5.153 0 107.153 2a5.153 5.153 0 000 10.307zm5.716-.852l2.838 2.838a1 1 0 01-1.414 1.414l-2.838-2.838a7.153 7.153 0 111.414-1.414z"
                                    fill="#C0C2CC" fill-rule="nonzero"></path>
                            </svg></label>
                            <input id="inputContent" name="inputContent" type="search" class="form-control"
                                placeholder="Search Light Novel By Title" aria-label="Novel Search"
                                aria-describedby="basic-addon1" />
                        </div>
                    </form>
                    <section id="novelListBase">
                        <ul class="novel-list horizontal col2">
                            {novelListBase}
                        </ul>
                    </section>
                </div>
            </article>
        </main >
    )
}

export default Search