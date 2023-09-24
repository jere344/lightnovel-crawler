import CommentSection from './CommentSection'

function AdjacentCommentSection ({ adjacents, setReplyTo, setCommenting, defaultSort='reactions'}) {
    var commentSections = []

    Object.entries(adjacents).forEach(([source, adjacent]) => {
        if (adjacent.length === 0) return
        commentSections.push(
            <div className={`comment-section-${source}`} key={source}>
                <h3>Comments for {source}</h3>
                <CommentSection comments={adjacent} setReplyTo={setReplyTo} setCommenting={setCommenting} defaultSort={defaultSort} />
            </div>
        )
    })
    return commentSections
}

export default AdjacentCommentSection
