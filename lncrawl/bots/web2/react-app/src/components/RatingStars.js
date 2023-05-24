import React, { useState } from "react";


function RatingStars(param) {
    const [ratingHovered, setRatingHovered] = useState(false);
    const rating = param.rating;
    const count = param.count;
    const ratingStars = [];

    const formatter = Intl.NumberFormat('en', { notation: 'compact' })

    const [thanksPanelActive, setThanksPanelActive] = useState(false);



    function rate(rating) {
        fetch("https://api.lncrawler.monster/rate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                novel: param.novel,
                rating: rating,
            }),
        });


        setThanksPanelActive(true);
        setTimeout(function () { console.log("thanks panel inactive"); setThanksPanelActive(false); }, 3000);
    }



    for (let i = 1; i <= 5; i++) {
        if (ratingHovered === false) {
            // If not hovered, show the rating
            // If rating is 3.5, show 3 stars filled, 1 star half filled, 1 star empty
            ratingStars.push(
                <span className="star-wrap" key={i} >
                    <i className={"icon-star" + ((i > rating) ? ((i < rating + 1) ? "-half-alt" : "-empty") : "")}
                        onMouseEnter={() => { setRatingHovered(i) }}
                        onMouseOut={() => { setRatingHovered(false) }}
                        onClick={() => { rate(i) }}>
                    </i>
                </span>
            );
        } else {
            ratingStars.push(
                <span className="star-wrap" key={i} >
                    <i className={"icon-star" + ((i > ratingHovered) ? "-empty" : "") + " hovered"}
                        onMouseEnter={() => { setRatingHovered(i) }}
                        onMouseOut={() => { setRatingHovered(false) }}
                        onClick={() => { rate(i) }}>
                    </i>
                </span>
            );
        }
    }


    return (
        <div className="rating-stars-container">
            <p>{ratingStars}
                <strong>{formatter.format(rating)} ({formatter.format(count)})</strong>
            </p>
            <div className={"thanks-panel" + (thanksPanelActive ? " active" : "")}>
                <div className="thanks-panel-rating-text">
                    Thank you!
                </div>
            </div>
        </div>
    )
}

export default RatingStars