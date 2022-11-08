import React from 'react';
import PropTypes from 'prop-types'
import { ownerContext } from '../ownerContext';
import { tokenContext } from '../token-context';

// From material ui
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slider from '@mui/material/Slider';
import makeRequest from '../makeRequest';

export default function ListingCard ({ id, title, thumbnail, reviews, bookings }) {
  const { ownerGetter } = React.useContext(ownerContext);
  const [rating, setRating] = React.useState(3);
  const [comment, setComment] = React.useState('');
  const { getters } = React.useContext(tokenContext)
  const [currentBooking, setBooking] = React.useState(undefined);
  const [hasBooking, setHasBooking] = React.useState(false);
  const [currentReviews, setCurrentReviews] = React.useState(reviews);
  // Material ui variables
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  React.useEffect(() => {
    let i = 0;
    while (bookings[i.toString()] !== undefined) {
      console.log(i);
      const booking = bookings[i.toString()];
      if (ownerGetter.owner === booking.owner && booking.status === 'accepted' && parseInt(booking.listingId) === id) {
        setBooking(booking)
        setHasBooking(true);
        break;
      }
      i += 1;
    }
  })

  const submitComment = () => {
    const review = { rating, comment }
    const data = { review }
    makeRequest(`/listings/${currentBooking.listingId}/review/${currentBooking.id}`, 'put', data, getters.token).then(() => {
      const updateReviews = currentReviews;
      updateReviews.push(review);
      const cloneReviews = JSON.parse(JSON.stringify(updateReviews));
      setCurrentReviews(cloneReviews);
    })
  }

  const valuetext = (value) => {
    return `${value} stars`;
  }

  return (
    <div>
      <div>{title}</div>
      <img alt={`listing thumbnail-${title}`} src={thumbnail}></img>
      <div>Number of reviews: {currentReviews.length}</div>
      {hasBooking && <div>
        <Button variant="outlined" onClick={handleClickOpen}>
          Leave a review
        </Button>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Write a review on your stay</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Tell others the details of your stay!
            </DialogContentText>
            <br></br><br></br><br></br>
            <Slider
            aria-label="Rating"
            defaultValue={3}
            getAriaValueText={valuetext}
            valueLabelDisplay="auto"
            step={1}
            marks
            min={1}
            max={5}
            onChange={event => setRating(parseInt(event.target.value))}
          />
          <TextField
            autoFocus
            margin="dense"
            id="comment"
            label="Comment"
            type="text"
            fullWidth
            variant="standard"
            onChange={event => setComment(event.target.value)}
          />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={() => {
              handleClose();
              submitComment();
            }}
            >Subscribe
            </Button>
          </DialogActions>
        </Dialog>
      </div>}
    </div>
  );
}
ListingCard.propTypes = {
  id: PropTypes.number,
  title: PropTypes.string,
  thumbnail: PropTypes.string,
  reviews: PropTypes.array,
  bookings: PropTypes.array
}
