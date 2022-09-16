import React, { useState } from "react";


function RatingStars(param) {
    const [ratingHovered, setRatingHovered] = useState(false);
    const rating = param.rating;
    const count = param.count;
    const ratingStars = [];

    function rate(rating) {
        fetch("/api/rate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                novel: param.novel,
                rating: rating,
            }),
        })
        // TODO : Show thank you message
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
                    <i className={"icon-star" + ((i > rating) ? "-empty" : "")}
                        onMouseEnter={() => { setRatingHovered(i) }}
                        onMouseOut={() => { setRatingHovered(false) }}
                        onClick={() => { rate(i) }}>
                    </i>
                </span>
            );
        }
    }


    return (

        <p>{ratingStars}
            <strong>{rating} ({count})</strong>
        </p>
    )
}

export default RatingStars