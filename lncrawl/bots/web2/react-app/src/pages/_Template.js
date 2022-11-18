import Metadata from '../components/Metadata';

function Template() {

    const title = "Read Light Novels Online For Free | LnCrawler";
    const description = "Read world famous Japanese Light Novels, Chinese Light Novels and Korean Light Novels in any language from more that 140 different websites."
    const imageUrl = "WEBSITE_URL + '/static/assets/logo.png'"
    const imageAlt = "LnCrawler"
    const imageType = "image/bmp"



    return (
        <main role="main">
            <Metadata description={description} title={title} imageUrl={imageUrl} imageAlt={imageAlt} imageType={imageType} />
            <article id="explore" className="container">
                <header id="Result">
                    <h1>{title}</h1>
                    <p className="description">{description}</p>
                </header>
                <p>Content</p>
            </article >
        </main >
    )
}

export default Template