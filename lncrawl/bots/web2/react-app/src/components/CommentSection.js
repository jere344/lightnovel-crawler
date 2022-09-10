import Comment from './Comment';


function CommentSection({ comments }) {
    // Recursively render comments

    const commentList = [];
    for (const [id, commentData] of Object.entries(comments)) {
        const commentItem = <Comment comment={commentData} key={id} />
        let replies = commentData.children ? <CommentSection comments={commentData.children} /> : null;
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