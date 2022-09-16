import NovelItemClassic from './novelItem/NovelItemClassic';
import NovelItemCompactClicks from './novelItem/NovelItemCompactClicks';
import NovelItemCompactRating from './novelItem/NovelItemCompactRating';
import NovelItemCompactTrends from './novelItem/NovelItemCompactTrends';
import NovelItemCard from './novelItem/NovelItemCard';
import NovelItemChapter from './novelItem/NovelItemChapter';

function NovelList({ novels, className, type = 'classic' }) {
    const novelItemList = [];
    Object.entries(novels).forEach(entry => {
        const [id, novel] = entry;
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