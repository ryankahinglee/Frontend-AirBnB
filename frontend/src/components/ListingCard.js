import React from 'react';
import PropTypes from 'prop-types'

export default function ListingCard ({ title, thumbnail, reviews }) {
  console.log(title);
  return (
    <div>
      <div>{title}</div>
      <img alt={`listing thumbnail-${title}`} src={thumbnail}></img>
      <div>Number of reviews: {reviews.length}</div>
    </div>
  );
}
ListingCard.propTypes = {
  title: PropTypes.string,
  thumbnail: PropTypes.string,
  reviews: PropTypes.array
}
