// https://mui.com/material-ui/react-dialog/
import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import PropTypes from 'prop-types';

export default function SpecificRatingReviews ({ state, stateSetter, reviews, rating }) {
  const handleClose = () => {
    stateSetter(!state);
  };

  return (
    <div>
      <Dialog open={state} onClose={handleClose}>
        <DialogTitle>{`${rating} Star Reviews`}</DialogTitle>
        <DialogContent>
          {reviews.filter(review => review.rating === rating).map((review, index) => (
            <div key={`review-${index}`}>
              Rating: {review.rating} <br />
              Comment: {review.comment}
            </div>
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
