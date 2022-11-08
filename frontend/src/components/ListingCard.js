import React from 'react';
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'

export default function ListingCard ({ title, thumbnail, reviews, lId }) {
  const navigate = useNavigate();
  return (
    <div>
      <div>{title}</div>
      <img alt={`listing thumbnail-${title}`} src={thumbnail}></img>
      <div>Number of reviews: {reviews.length}</div>
      <button onClick={() => { navigate(`listingdetails/${lId}`) }}>
        View Details
      </button>
    </div>
  );
}
ListingCard.propTypes = {
  title: PropTypes.string,
  thumbnail: PropTypes.string,
  reviews: PropTypes.array,
  lId: PropTypes.number
}
