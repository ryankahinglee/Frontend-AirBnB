import React from 'react';
import PropTypes from 'prop-types'

export default function Review ({ rating, comment }) {
  return (
    <div>
      <div> Rating: {rating} </div>
      <div> Comment: {comment}</div>
    </div>
  );
}

Review.propTypes = {
  rating: PropTypes.number,
  comment: PropTypes.string
}
