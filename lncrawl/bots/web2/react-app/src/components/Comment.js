import { useState } from 'react';

function Comment({ comment, setReplyTo, setCommenting }) {

    const [liked, setLiked] = useState(false);
    const [disliked, setDisliked] = useState(false);

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

    function addReaction(type, commentId) {
        if (type === "like") {
            if (liked) {
                setLiked(false);
            } else {
                setLiked(true);
                setDisliked(false);
            }
        }
        else if (type === "dislike") {
            if (disliked) {
                setDisliked(false);
            } else {
                setLiked(false);
                setDisliked(true);
            }
        }

        const data = {
            "page": window.location.pathname,
            "comment_id": commentId,
            "reaction": type
        }

        fetch('https://api.lncrawler.monster/add_reaction', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(data => {
                if (!(data.status === "success")) {
                    alert(data.message)
                }
            }
            )

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
                <div className="comment-text" itemProp="text" data-spoiler={comment.spoiler ? "1" : "0"} onClick={e => e.target.dataset.spoiler = "0"}>
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
                            <input id={"inputlike-" + comment.id} type="radio" name={comment.id} value={comment.likes} disabled="" checked={liked} onClick={() => { addReaction('like', comment.id) }} readOnly={true} />
                            <label htmlFor={"inputlike-" + comment.id} className="" disabled="">
                                <i className="icon-thumbs-up"></i>
                                <span className="lc">{parseInt(comment.likes, 10) + (liked ? 1 : 0)}</span>
                            </label>
                        </span>
                        <span className="divider"></span>
                        <span className="_grp">
                            <input id={"inputdislike-" + comment.id} type="radio" name={comment.id} value={comment.dislikes} disabled="" checked={disliked} onClick={() => addReaction('dislike', comment.id)} readOnly={true} />
                            <label htmlFor={"inputdislike-" + comment.id} className="" disabled="">
                                <span className="dlc">{parseInt(comment.dislikes, 10) + (disliked ? 1 : 0)}</span>
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