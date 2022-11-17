import React from 'react';
import PropTypes from 'prop-types'
import { contextVariables } from '../helpers/contextVariables';

// Components of material.mui from https://mui.com/material-ui/react-dialog/
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Slider, Box } from '@mui/material'
import makeRequest from '../helpers/makeRequest';
import { useNavigate, useSearchParams, createSearchParams } from 'react-router-dom'
import { styled } from '@mui/system';

export default function ListingCard ({ id, title, thumbnail, reviews, bookings }) {
  const [rating, setRating] = React.useState(3);
  const [comment, setComment] = React.useState('');
  const { getters } = React.useContext(contextVariables)
  const [currentReviews, setCurrentReviews] = React.useState(reviews);
  // Material ui variables
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  let currentBooking = null;
  let hasBooking = false;
  for (const booking of bookings) {
    if (getters.owner === booking.owner && booking.status === 'accepted' && parseInt(booking.listingId) === id) {
      currentBooking = booking;
      hasBooking = true;
      break;
    }
  }

  const submitComment = () => {
    const review = { rating, comment }
    const data = { review }
    makeRequest(`/listings/${currentBooking.listingId}/review/${currentBooking.id}`, 'put', data, getters.token).then(() => {
      const updateReviews = currentReviews;
      updateReviews.push(review);
      const cloneReviews = JSON.parse(JSON.stringify(updateReviews));
      setCurrentReviews(cloneReviews);
    })
  };

  const valuetext = (value) => {
    return `${value} stars`;
  };
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const conditions = [];
  for (const [key, value] of searchParams.entries()) {
    if (value !== 'undefined' && (key === 'startDate' || key === 'endDate')) {
      conditions[key] = value;
    }
  }

  const ListingBox = styled(Box)({
    display: 'flex',
    width: '299.8px',
    height: '400px',
    margin: '10px 10px',
    border: 'solid',
    borderWidth: '0.1vh',
    borderRadius: '5px',
    borderColor: '##6392e3',
    flexDirection: 'column',
    justifyContent: 'space-between',
  })
  return (
    <ListingBox>
      <img style={{ height: '300px', width: '300px' }} alt={`listing thumbnail-${title}`} src={thumbnail}></img>
      <Box sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
      }}>
        <h4 style={{ padding: '0px 10px' }}>{title}</h4>
        <div style={{ padding: '20px 10px' }}>
          {currentReviews.length} reviews
        </div>
      </Box>
      {hasBooking && <Box>
        <Button variant="outlined"
          onClick={handleClickOpen}
          style={{
            width: '299.8px'
          }}
        >
          Leave a review
        </Button>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Write a review on your stay</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Tell others the details of your stay!
            </DialogContentText>
            <br /><br /><br />
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
      </Box>}
      <Button variant='outlined' name='view-details-button' onClick={() => {
        let params = {}
        if (conditions.startDate !== undefined && conditions.endDate !== undefined) {
          const startDate = conditions.startDate;
          const endDate = conditions.endDate;
          params = { startDate, endDate };
        }
        navigate({
          pathname: `/listingdetails/${id}`,
          search: `?${createSearchParams(params)}`,
        });
      }}>
        View Details
      </Button>
    </ListingBox>
  );
}
ListingCard.propTypes = {
  id: PropTypes.number,
  title: PropTypes.string,
  thumbnail: PropTypes.string,
  reviews: PropTypes.array,
  bookings: PropTypes.array,
}
