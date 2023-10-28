import { useState } from 'react'
import { API_URL } from "../config.js"
import { useCookies } from 'react-cookie'

function RateSource ({ novelSlug, sourceSlug }) {
    const [thanksPanelActive, setThanksPanelActive] = useState(false)
    const [rated, setRated] = useState(false)
    
    function sendRating (rating) {
        fetch(`${API_URL}/rate_source`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                novel: novelSlug,
                source: sourceSlug,
                rating: rating,
            }),
        })
        
        setThanksPanelActive(true)
        setRated(true)
        setTimeout(function () {
            setThanksPanelActive(false)
        }, 1500)
    }
    
    const [doNotShowRateCookie, setDoNotShowRateCookie] = useCookies(['doNotShowRate'])
    function setDoNotShowRate(bool) {
        setDoNotShowRateCookie('doNotShow', bool, { path: '/', sameSite: 'strict', maxAge: 2592000 });
    }
    if (doNotShowRateCookie['doNotShow'] === 'true') {
        return null
    }

    if (!rated) {
        return (
            <div className='lnw-modal _show' id='childcomeditor'>
                <div className='modal-section'>
                    <button onClick={() => setRated(true)} className='_close'>
                        <i className='icon-cancel'></i>
                    </button>
                    <div className='modal-header'>Is this source well formatted?</div>
                    <div className='modal-body'>
                        <p>
                            Please tell us if this source is good. This includes : <br />
                            - Is the text well formatted? <br />
                            - Does it have a fitting cover image? <br />
                            - Are the chapters in order and not missing? <br />
                            - Is the novel in the correct language and is the translation good? <br />
                            ... <br />
                            This will help us improve the quality of the site, Thank you for your help!
                        </p>
                        <div className='do-not-show'>
                            <button onClick={() => {setDoNotShowRate(true); setRated(true)}} className='modal-button'>
                                Do not show again
                            </button>
                        </div>
                    </div>
                    <div className='modal-rating-area'>
                        <div className='upvote'>
                            <button id='compostbtn' className='button' onClick={() => sendRating(1)}>
                                <i className='icon-thumbs-up'></i>
                            </button>
                        </div>
                        <div className='downvote'>
                            <button id='compostbtn' className='button' onClick={() => sendRating(-1)}>
                                <i className='icon-thumbs-down'></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    } else {
        return (
            <div className={'thanks-panel' + (thanksPanelActive ? ' active' : '')}>
                <div className='thanks-panel-rating-text'>Thank you!</div>
            </div>
        )
    }
}

export default RateSource
