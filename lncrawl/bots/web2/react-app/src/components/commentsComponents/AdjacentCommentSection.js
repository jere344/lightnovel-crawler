import CommentSection from './CommentSection'

function AdjacentCommentSection ({ adjacents, setReplyTo, setCommenting }) {
    var commentSections = []

    Object.entries(adjacents).forEach(([source, adjacent]) => {
        if (adjacent.length === 0) return
        commentSections.push(
            <div className={`comment-section-${source}`} key={source}>
                <h3>Comments for {source}</h3>
                <CommentSection comments={adjacent} setReplyTo={setReplyTo} setCommenting={setCommenting} />
            </div>
        )
    })
    return commentSections
}

export default AdjacentCommentSection
