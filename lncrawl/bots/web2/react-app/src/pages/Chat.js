import Metadata from '../components/Metadata';
import CommentComponent from '../components/commentsComponents/CommentComponent';
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';
import logo from '../assets/logo.png'

function Chat() {
    const { subject } = useParams().subject.replace('chat-', '');

    const title = `LnCrawler ${subject} Chat | LnCrawler`;
    const description = "Request novel, report error, chat with other readers and get latest updates on LnCrawler."
    const imageUrl = logo
    const imageAlt = "LnCrawler"
    const imageType = "image/bmp"


    return (

        <main role="main">
            <Metadata description={description} title={title} imageUrl={imageUrl} imageAlt={imageAlt} imageType={imageType} />
            <Helmet>
                <meta name="robots" content="index" />
                <link rel="canonical" href={window.location.href} />
            </Helmet>
            <article>
                <div className="novel-body container">
                    <CommentComponent currentUrl={window.location.pathname} defaultSort='replies-date' />
                </div>
            </article>
        </main >
    )
}

export default Chat