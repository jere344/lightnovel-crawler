import Comment from './Comment'

function CommentSection ({ comments, setReplyTo, setCommenting }) {
    // Recursively render comments

    function numberOfReplies (comment) {
        let count = 0
        for (const child in comment.replies) {
            count += 1 + numberOfReplies(comment.replies[child])
        }
        return count
    }

    function sortComments (type, object) {
        if (type === 'date') {
            return Object.entries(object).sort((a, b) => new Date(b[1].date) - new Date(a[1].date))
        } else if (type === 'likes') {
            return Object.entries(object).sort((a, b) => b[1].likes - a[1].likes)
        } else if (type === 'dislikes') {
            return Object.entries(object).sort((a, b) => b[1].dislikes - a[1].dislikes)
        } else if (type === 'replies') {
            return Object.entries(object).sort(
                (a, b) => Object.keys(b[1].replies).length - Object.keys(a[1].replies).length
            )
        } else if (type === 'reactions') {
            return Object.entries(object).sort(
                (a, b) =>
                    b[1].likes +
                    b[1].dislikes +
                    numberOfReplies(b[1]) -
                    (a[1].likes + a[1].dislikes + numberOfReplies(a[1]))
            )
        } else {
            return Object.entries(object)
        }
    }

    const commentList = []
    for (const [id, commentData] of sortComments('reactions', comments)) {
        const commentItem = (
            <Comment comment={commentData} key={id} setCommenting={setCommenting} setReplyTo={setReplyTo} />
        )
        let replies = commentData.replies ? (
            <CommentSection comments={commentData.replies} setReplyTo={setReplyTo} setCommenting={setCommenting} />
        ) : null
        commentList.push(
            <li key={id}>
                {commentItem}
                {replies ? <div className='spacer'></div> : null}
                {replies ? <div className='reply-comments'>{replies}</div> : null}
            </li>
        )
    }

    return <ul>{commentList}</ul>
}

export default CommentSection
