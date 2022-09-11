import CommentPrompt from "./CommentPrompt"
import { useState } from "react";

function TermsPrompt(params) {
    const [termAccepted, setTermAccepted] = useState(false);
    const [boxChecked, setBoxChecked] = useState(false);
    if (termAccepted) {
        return <CommentPrompt reply_to={params.reply_to} setCommenting={params.setCommenting} />

    } else {
        return (
            <div className="lnw-modal _show" id="lnwcomtermpanel">
                <section className="modal-section">
                    <div className="modal-header">Comment &amp; Review Terms of Use</div>
                    <div className="modal-body">
                        <div className="comment-terms">
                            <p>The responsibility of the content in the comments belongs to the user and the Light Novel Pub platform cannot be held responsible.</p>
                            <p>Platform administrators and editors have the authority to edit and delete comments.</p>
                            <p>Behaviors that are strictly prohibited in the comment and review sections;</p>
                            <ol>
                                <li>Using insulting and abusive expressions against users,</li>
                                <li>To insult the novel and the author,</li>
                                <li>Sharing the name or link of competitive websites,</li>
                                <li>Sharing platform channels such as Discord that publish early novel chapters,</li>
                                <li>Using the comment field with random expressions and characters,</li>
                            </ol>
                            <p>Accounts of users who do not follow the rules listed above will be banned without warning.</p>
                        </div>
                        <form onSubmit={e => { e.preventDefault() }}>
                            <div className="fieldset">
                                <input id="term_accept_rule" name="acceptrule" type="checkbox" value="true" onClick={() => setBoxChecked(!boxChecked)} />
                                <label htmlFor="term_accept_rule">I accept all terms and promise to follow the rules.</label>
                            </div>
                            <div className="center">
                                <input id="term_accept" type="submit" value="Accept" disabled={!boxChecked} onClick={() => setTermAccepted(true)} />
                                <label id="term_accept_lbl" htmlFor="term_accept" className={"button" + (boxChecked ? "" : " isDisabled")}>Accept</label>
                            </div>
                        </form>
                    </div>
                </section>
            </div>
        )
    }
}

export default TermsPrompt