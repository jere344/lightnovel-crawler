import React, { useState } from "react";


function RatingStars(param) {
    const [ratingHovered, setRatingHovered] = useState(false);

    const roundedRating = parseInt(param.rating);
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
        ratingStars.push(
            <span className="star-wrap" key={i} >
                <i className={"icon-star" + (i > (ratingHovered ? ratingHovered : roundedRating) ? "-empty" : "")}
                    onMouseEnter={() => { setRatingHovered(i) }}
                    onMouseOut={() => { setRatingHovered(false) }}
                    onClick={() => { rate(i) }}>
                </i>
            </span>
        );
    }

    return (
        <p>{ratingStars}
            <strong>{rating} ({count})</strong>
        </p>
    )
}

export default RatingStars