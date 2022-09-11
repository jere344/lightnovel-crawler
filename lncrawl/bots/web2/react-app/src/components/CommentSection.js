import Comment from './Comment';


function CommentSection({ comments, setReplyTo, setCommenting }) {
    // Recursively render comments

    const commentList = [];
    for (const [id, commentData] of Object.entries(comments)) {
        console.log("commentData", commentData)
        const commentItem = <Comment comment={commentData} key={id} setCommenting={setCommenting} setReplyTo={setReplyTo} />
        console.log("replies", commentData.replies)
        let replies = commentData.replies ? <CommentSection comments={commentData.replies} setReplyTo={setReplyTo} setCommenting={setCommenting} /> : null;
        commentList.push(
            <li key={id}>
                {commentItem}
                {replies ? <div className="spacer"></div> : null}
                {replies ? (<div className="reply-comments">{replies}</div>) : null}
            </li>
        )
    }

    return (
        <ul>
            {commentList}
        </ul>
    );
}

export default CommentSection;