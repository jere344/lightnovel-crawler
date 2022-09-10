import { useState, useEffect } from "react"
import CommentSection from "./CommentSection"

import "../assets/stylesheets/comments.min.css"

// const exemple = {
//     "0": {
//         "name": "Anonymous",
//         "text": "This is a test comment",
//         "date": "2021-08-01T00:00:00.000Z",
//         "id": "0",
//         "rank": "Reader",
//         "likes": "0",
//         "dislikes": "0",
//         "children": {
//             "0": {
//                 "name": "Anonymous",
//                 "text": "This is a test reply",
//                 "date": "2021-08-01T00:00:00.000Z",
//                 "id": "0",
//                 "rank": "Reader",
//                 "likes": "0",
//                 "dislikes": "0",
//                 "children": {},
//             },
//         },
//     },
//     "1": {
//         "name": "Anonymous",
//         "text": "This is a test comment",
//         "date": "2021-08-01T00:00:00.000Z",
//         "id": "1",
//         "rank": "Reader",
//         "likes": "0",
//         "dislikes": "0",
//         "children": {},
//     },
// }




function CommentComponent(target) {
    const url = `/api/get_comments?page=${target.url}`
    const [comments, setComments] = useState([])

    useEffect(() => {
        fetch(url)
            .then(response => response.json())
            .then(data => setComments(data.content))
    }, [url])

    function submitComment() {
        console.log("Not implemented")
    }

    return (
        <section className="comment-list" data-objectid="1422" data-objtype="1">
            <div className="head">
                <h4>User Comments</h4>
                <button className="button" title="You must be logged in to post a comment." onClick={() => submitComment()}>Write Comment</button>
            </div>
            <div className="comment-policy">
                <button id="comment-policy-show" onClick={() => submitComment()}>Please read and apply the rules before posting a comment.</button>
                <br />
                By sharing your comment, you agree to all the relevant terms.
            </div>
            <div className="comment-wrapper">
                <CommentSection comments={comments} />
            </div>
        </section>
    )
}

export default CommentComponent