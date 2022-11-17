import React from 'react';
import PropTypes from 'prop-types'
import { Box } from '@mui/material'
import { styled } from '@mui/system';

// This component displays a singular review's rating and comment which is shown in a listing's details page
export default function Review ({ rating, comment }) {
  const Label = styled('span')({
    color: '#286ee6'
  })

  const ReviewBox = styled(Box)({
    border: 'solid',
    borderRadius: '10px',
    borderColor: '#6392e3 ',
    borderWidth: '0.1px',
    padding: '5px',
    margin: '5px',
    textAlign: 'center',
    width: '200px'
  })
  return (
    <ReviewBox name='box'>
      <h3 style={{ color: '#286ee6' }}>Review</h3>
      <p>
        <Label>Rating:</Label> {rating}
      </p>
      <p style={{ overflowWrap: 'break-word' }}>{comment}</p>
    </ReviewBox>
  );
}

Review.propTypes = {
  rating: PropTypes.number,
  comment: PropTypes.string
}
