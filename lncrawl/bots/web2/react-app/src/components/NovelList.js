import NovelItem from './NovelItem';

function NovelList(novels) {
    novels = novels.novels
    const novelItemList = [];
    Object.entries(novels).forEach(entry => {
        const [id, novel] = entry;
        novelItemList.push(
            <NovelItem novel={novel} key={id} />
        );
    });
    return novelItemList
}

export default NovelList