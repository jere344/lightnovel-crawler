import NovelItemClassic from './novelItem/NovelItemClassic';
import NovelItemCompactClicks from './novelItem/NovelItemCompactClicks';
import NovelItemCompactRating from './novelItem/NovelItemCompactRating';
import NovelItemCompactTrends from './novelItem/NovelItemCompactTrends';
import NovelItemCard from './novelItem/NovelItemCard';
import NovelItemChapter from './novelItem/NovelItemChapter';
import loadIcon from "./../assets/load-icon-png-8.png";



const placeholderSource = {
    'title': 'Loading...',
    'novel': null,
    'cover': null,
    'author': 'Loading...',
    'chapter_count': 0,
    'slug': 'loading',
    'first': 'Loading...',
    'latest': 'Loading...',
    'summary': 'Loading...',
    'tags': ['Loading...'],
    'language': 'Loading...',
    'url': 'Loading...',
    'last_update_date': 'Loading...',
}

const placeholderNovel = {
    'title': 'Loading...',
    'cover': null,
    'author': 'Loading...',
    'chapter_count': 0,
    'latest': 'Loading...',
    'language': 'Loading...',
    'clicks': 0,
    'current_week_clicks': 0,
    'rank': 0,
    'prefered_source': 'Loading...',
    'sources': {},
    'overall_rating': 0,
    'ratings_count': 0,
    'source_count': 0,
    'slug': 'loading',
    'comment_count': 0,
}
placeholderSource.novel = placeholderNovel;
placeholderNovel.sources['Loading...'] = placeholderSource;

function NovelList({ novels, className, type = 'classic', placeholderAmount = '12' }) {
    const novelItemList = [];

    if (novels === null) {
        novels = {};
        for (let i = 0; i < parseInt(placeholderAmount); i++) {
            // chapter is a list of novel from sources instead of novels
            if (type === 'chapter') {
                novels[i] = placeholderSource;
            } else {
                novels[i] = placeholderNovel;
            }
        }
    }


    Object.entries(novels).forEach(entry => {
        const [id, novel] = entry;
        if (!novel.cover) {
            novel.cover = loadIcon;
        }
        else if (!novel.cover.startsWith('/api/image/') && novel.cover !== loadIcon){
            novel.cover = `/api/image/${novel.cover}`
        }

        if (type === 'classic') {
            novelItemList.push(<NovelItemClassic key={id} novel={novel} />);
        } else if (type === 'compact-clicks') {
            novelItemList.push(<NovelItemCompactClicks key={id} novel={novel} />);
        } else if (type === 'compact-rating') {
            novelItemList.push(<NovelItemCompactRating key={id} novel={novel} />);
        } else if (type === 'compact-trends') {
            novelItemList.push(<NovelItemCompactTrends key={id} novel={novel} />);
        } else if (type === 'card') {
            novelItemList.push(<NovelItemCard key={id} novel={novel} />);
        } else if (type === 'chapter') {
            novelItemList.push(<NovelItemChapter key={id} novel={novel} />);
        }


    });
    return (
        <ul className={className}>
            {novelItemList}
        </ul>
    )

}

export default NovelList