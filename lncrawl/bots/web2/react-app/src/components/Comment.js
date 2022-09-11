function Comment({ comment, setReplyTo, setCommenting }) {


    function formatTimeAgo(timeAgo) {
        const seconds = Math.floor(timeAgo / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const months = Math.floor(days / 30);
        const years = Math.floor(months / 12);
        if (seconds < 60) {
            return `${seconds} seconds ago`;
        } else if (minutes < 60) {
            return `${minutes} minutes ago`;
        } else if (hours < 24) {
            return `${hours} hours ago`;
        } else if (days < 30) {
            return `${days} days ago`;
        } else if (months < 12) {
            return `${months} months ago`;
        } else {
            return `${years} years ago`;
        }
    }


    const date = new Date(comment.date)
    const timeAgo = (new Date().getTime()) - date.getTime();
    const formatedTimeAgo = formatTimeAgo(timeAgo)

    //onClick={e => document.getElementById(comment.reply_to).scrollIntoView()}


    return (
        <article className="comment-item  none" id={comment.id}>
            <div className="comment-body" itemProp="comment" itemScope="" itemType="http://schema.org/Comment">
                <meta itemProp="dateCreated" content={date.toString()} />
                <div className="header">
                    <div className="comment-info" itemProp="creator" itemScope="" itemType="http://schema.org/Person">
                        <div className="username" itemProp="sameAs">
                            <span itemProp="name">{comment.name}</span>
                        </div>
                        <div className="sub-items">
                            <span className="tier tier0">{comment.rank}</span>
                        </div>
                    </div>
                </div>
                <div className="comment-text" itemProp="text" data-spoiler="0">
                    <p>{comment.text}</p>
                </div>
                <div className="toolbar">
                    <span className="_tl">{formatedTimeAgo}</span>
                    <span className="divider"></span>
                    <span className="_tl">
                        <button className="" disabled="" onClick={() => { setReplyTo(comment.id); setCommenting(true) }}><i className="icon-commenting-o"></i>Reply</button>
                    </span>
                    <span className="spacer"></span>
                    <div className="usrlike" data-uvtype="0" data-lc="0" data-dlc="0">
                        <span className="_grp">
                            <input id="inputlike" type="radio" name="ulike" value={comment.likes} disabled="" />
                            <label htmlFor="inputlike" className="isDisabled" disabled="">
                                <i className="icon-thumbs-up"></i>
                                <span className="lc">{comment.likes}</span>
                            </label>
                        </span>
                        <span className="divider"></span>
                        <span className="_grp">
                            <input id="inputdislike" type="radio" name="ulike" value={comment.dislikes} disabled="" />
                            <label htmlFor="inputdislike" className="isDisabled" disabled="">
                                <span className="dlc">{comment.dislikes}</span>
                                <i className="icon-thumbs-down"></i>
                            </label>
                        </span>
                    </div>
                </div>
            </div>
        </article>
    )
}

export default Comment