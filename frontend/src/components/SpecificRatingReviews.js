// https://mui.com/material-ui/react-dialog/
import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import PropTypes from 'prop-types';
import { styled } from '@mui/system';

// This component refers to the modal which displays reviews for a listing for a specific star rating
export default function SpecificRatingReviews ({ state, stateSetter, reviews, rating }) {
  const handleClose = () => {
    stateSetter(!state);
  };

  const Label = styled('span')({
    color: '#286ee6'
  })

  return (
    <div>
      <Dialog open={state} onClose={handleClose}>
        <DialogTitle style={{ color: '#286ee6' }}>{`${rating} Star Reviews`}</DialogTitle>
        <DialogContent>
          {reviews.filter(review => review.rating === rating).map((review, index) => (
            <p key={`review-${index}`}>
              <Label>Rating: {review.rating} </Label>
              <p style={{ width: '400px', overflowWrap: 'break-word' }}>{review.comment}</p>
            </p>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

SpecificRatingReviews.propTypes = {
  state: PropTypes.bool,
  stateSetter: PropTypes.func,
  reviews: PropTypes.array,
  rating: PropTypes.number
}
