import React from 'react'

function RatingStars(param) {
    const roundedRating = parseInt(param.rating);
    const rating = param.rating;
    const count = param.count;
    const ratingStars = [];
    for (let i = 0; i < roundedRating; i++) {
        ratingStars.push(
            <span className="star-wrap" key={i}>
                <i className="icon-star"></i>
            </span>
        );
    }
    for (let i = 0; i < 5 - roundedRating; i++) {
        ratingStars.push(
            <span className="star-wrap" key={roundedRating + i}>
                <i className="icon-star-empty"></i>
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