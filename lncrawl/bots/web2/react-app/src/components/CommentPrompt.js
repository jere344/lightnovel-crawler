import { useState } from 'react';

function CommentPrompt(data) {
    const reply_to = data.reply_to;
    const [text, setText] = useState("");
    const [name, setName] = useState("");
    const [isSpoiler, setIsSpoiler] = useState(false);


    function submitComment() {
        const data = {
            "text": text,
            "name": name,
            "page": window.location.pathname,
            "spoiler": isSpoiler,
        }
        if (reply_to) {
            data.reply_to = reply_to;
        }
        fetch("/api/add_comment", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === "success") {
                    window.location.reload();
                } else {
                    alert(data.message)
                }
            })
    }

    return (
        <div className="lnw-modal _show" id="childcomeditor">
            <div className="modal-section">
                <a href="javascript:;" className="_close">
                    <svg>
                        <use xlink:href="#i-times"></use>
                    </svg>
                </a>
                <div className="modal-header">Reply Comment</div><div className="comment-area">
                    <textarea id="name" className="txt_block" name="comment" minlength="3" maxlength="50"
                        placeholder="Pseudo"
                        onChange={e => setName(e.target.value)}></textarea>
                    <textarea id="comments" className="txt_block" name="comment" minlength="60" maxlength="20000"
                        placeholder="Join the discussion with your comment... Make sure you understand the comment rules before posting..."
                        onChange={e => setText(e.target.value)}></textarea>
                    <div className="comment-actions">
                        <label className="spoiler-check">
                            <input type="checkbox" id="spoilerControl" name="spoiler" value="1" onChange={e => setIsSpoiler(e.target.checked)} />
                            <span><i></i></span>
                            <strong>
                                Contains
                                <br />
                                Spoiler
                            </strong>
                        </label>
                        <button id="compostbtn" className="button" onClick={() => submitComment()}>Post Comment</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CommentPrompt;