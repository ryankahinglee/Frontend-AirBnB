import React from 'react';
import { contextVariables } from '../helpers/contextVariables';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import makeRequest from '../helpers/makeRequest';
import Review from '../components/Review';
import Booking from '../components/Booking';
import Star from '../components/Star';
import ImageDisplay from '../components/ImageDisplay';

// Material ui components
import { Tooltip, Alert, Box, Button, TextField } from '@mui/material';
import { styled } from '@mui/system';
import SpecificRatingReviews from '../components/SpecificRatingReviews';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

// This page displays detailed information about a listing

export default function ListingDetails () {
  const { getters } = React.useContext(contextVariables);
  const params = useParams();
  const navigate = useNavigate();
  const [owner, setOwner] = React.useState('');
  const [title, setTitle] = React.useState('');
  const [address, setAddress] = React.useState('');
  const [amenities, setAmenities] = React.useState('');
  const [price, setPrice] = React.useState(0);
  const [perStay, setPerStay] = React.useState(false);
  const [images, setImages] = React.useState([]);
  const [type, setType] = React.useState('');
  const [reviews, setReviews] = React.useState([]);
  const [reviewRatingFilter, setReviewRatingFilter] = React.useState(0);
  const [reviewsBreakdown, setReviewsBreakdown] = React.useState([]);
  const [rating, setRating] = React.useState(0);
  const [numBedrooms, setNumBedrooms] = React.useState(0);
  const [numBeds, setNumBeds] = React.useState(0);
  const [numBathrooms, setNumBathrooms] = React.useState(0);
  const [ownedBookings, setOwnedBookings] = React.useState([]);
  const [thumbnail, setThumbnail] = React.useState('');
  const date = new Date();
  const dateString = date.toISOString().split('T')[0]
  const [bookingStart, setBookingStart] = React.useState(dateString);
  const [bookingEnd, setBookingEnd] = React.useState(dateString);
  const [openReview, setOpenReview] = React.useState(false);
  const [alert, setAlert] = React.useState(false);
  const [invalidAlert, setInvalidAlert] = React.useState(false);
  const [searchParams] = useSearchParams();
  React.useEffect(() => {
    makeRequest(`/listings/${params.lId}`, 'get', undefined, '').then((res) => {
      const listing = res.listing;
      setOwner(listing.owner);
      setTitle(listing.title);
      // have to dynamically add address depending on what was entered
      setAddress(`${listing.address.streetDetails}, ${listing.address.city}, ${listing.address.state}, ${listing.address.postcode}, ${listing.address.country}`);
      setAmenities(listing.metadata.amenities);
      // setPrice(listing.price)
      const conditions = [];
      for (const [key, value] of searchParams.entries()) {
        if (value !== 'undefined') {
          conditions[key] = value;
        }
      }
      // Using general code of finding difference between two date objects in days
      let difference = new Date(conditions.endDate).getTime() - new Date(conditions.startDate).getTime();
      difference = Math.ceil(difference / (1000 * 3600 * 24));
      if (difference > 0) {
        setPrice(difference * listing.price);
        setPerStay(true);
      } else {
        setPrice(listing.price);
      }
      setImages(listing.metadata.images);
      setThumbnail(listing.thumbnail);
      setType(listing.metadata.type);
      setReviews(listing.reviews);
      let ratingSum = 0
      for (const review of listing.reviews) {
        ratingSum += parseInt(review.rating);
      }
      let oneStars = 0;
      let twoStars = 0;
      let threeStars = 0;
      let fourStars = 0;
      let fiveStars = 0;
      for (const review of listing.reviews) {
        switch (review.rating) {
          case 1:
            oneStars++;
            break;
          case 2:
            twoStars++;
            break;
          case 3:
            threeStars++;
            break;
          case 4:
            fourStars++;
            break;
          case 5:
            fiveStars++;
            break;
          default:
        }
      }
      setReviewsBreakdown([
        {
          rating: 1,
          count: oneStars,
          percentage: listing.reviews.length !== 0 ? Math.round((100 * oneStars) / listing.reviews.length) : 0
        },
        {
          rating: 2,
          count: twoStars,
          percentage: listing.reviews.length !== 0 ? Math.round((100 * twoStars) / listing.reviews.length) : 0
        },
        {
          rating: 3,
          count: threeStars,
          percentage: listing.reviews.length !== 0 ? Math.round((100 * threeStars) / listing.reviews.length) : 0
        },
        {
          rating: 4,
          count: fourStars,
          percentage: listing.reviews.length !== 0 ? Math.round((100 * fourStars) / listing.reviews.length) : 0
        },
        {
          rating: 5,
          count: fiveStars,
          percentage: listing.reviews.length !== 0 ? Math.round((100 * fiveStars) / listing.reviews.length) : 0
        }
      ])
      if (listing.reviews.length !== 0) {
        setRating(Math.round(ratingSum / listing.reviews.length));
      }
      setNumBedrooms(listing.metadata.bedrooms.length);
      let bedNum = 0;
      for (const bedroom of listing.metadata.bedrooms) {
        bedNum += parseInt(bedroom.numBeds);
      }
      setNumBeds(bedNum);
      setNumBathrooms(listing.metadata.bathrooms);
    })
    if (getters.token !== '') {
      makeRequest('/bookings', 'get', undefined, getters.token).then((res) => {
        const bookings = res.bookings;
        if (bookings.length !== 0) {
          setOwnedBookings(bookings.filter(booking => booking.owner === getters.owner && params.lId === booking.listingId));
        }
      });
    }
  }, []);

  const Header = styled('h2')({
    color: '#286ee6'
  })
  const DetailLabel = styled('span')({
    color: '#286ee6'
  })

  const PageBox = styled(Box)({
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: '92vh',
    flexDirection: 'column',
    margin: '5px'
  })

  const UpperBox = styled(Box)({
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
    border: 'solid',
    borderColor: '#6392e3',
    borderWidth: '0.1px',
    flexWrap: 'wrap'
  })
  return (
    <PageBox>
      <Box>
        <UpperBox>
          <Box sx={{ width: '300px' }}>
            <Header style={{ textAlign: 'center' }}>Details</Header>
            <p>
              <DetailLabel>Title:</DetailLabel>{` ${title}`}
            </p>
            <p>
              <DetailLabel>Address:</DetailLabel>{` ${address}`}
            </p>
            <p>
              <DetailLabel>Amenities:</DetailLabel>{` ${amenities}`}
            </p>
            <p>
              {perStay && (
                <DetailLabel>Price per Stay:</DetailLabel>
              )}
              {!perStay && (
                <DetailLabel>Price per Night:</DetailLabel>
              )}
              {` ${price}`}
            </p>
            <p>
              <DetailLabel>Property Type:</DetailLabel>{` ${type}`}
            </p>
            <p>
              <DetailLabel>Number of bedrooms:</DetailLabel>{` ${numBedrooms}`}
            </p>
            <p>
              <DetailLabel>Number of beds:</DetailLabel>{` ${numBeds}`}
            </p>
            <p>
              <DetailLabel>Number of Bathrooms:</DetailLabel>{` ${numBathrooms}`}
            </p>
          </Box>
          <Box>
          <Header style={{ textAlign: 'center' }}>Property Images</Header>
            {
              <ImageDisplay images={images} thumbnail={thumbnail} title={title} />
            }
          </Box>
        </UpperBox>
      </Box>
      <br />
      <Header>Reviews</Header>
      <Box>
        <SpecificRatingReviews state={openReview} stateSetter={setOpenReview} reviews={reviews} rating={reviewRatingFilter} />
        <Tooltip
          title={
            <React.Fragment>
              {
                reviewsBreakdown.map((review, index) => (
                  <div
                    key={`review-${index}`}
                    onClick={() => {
                      setOpenReview(!openReview);
                      setReviewRatingFilter(review.rating);
                    }}
                  >
                    <Button
                      variant='outlined'
                      sx={{
                        backgroundColor: 'white',
                        '&:hover': {
                          backgroundColor: '#cbddfb'
                        }
                      }}
                    >
                      {review.rating} stars</Button>
                    {` ${review.count} ratings, ${review.percentage}% of ratings `}
                  </div>
                ))
              }
            </React.Fragment>
          }
          placement="bottom"
        >
          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', margin: '0px 0px 5px 0px' }}>
            <Button variant='outlined' color='secondary' style= {{ width: '150px', height: '80px', fontSize: '22px' }}>{`Rating: ${rating}`}</Button>
            <div>
              {
                (new Array(rating).fill(0)).map((_, index) => (
                  <Star key={`star-${index}`} />
                )
                )
              }
            </div>
          </Box>
        </Tooltip>
      </Box>
      {reviews.map((rev, index) => (
        <Review key={`review-${index}`} rating={rev.rating} comment={rev.comment} />
      ))}
      {getters.token !== '' && owner !== getters.owner && (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Header>My bookings</Header>
          {ownedBookings.map((booking, index) => (
          <Booking
            key={`booking-${index}`}
            dateRange={booking.dateRange}
            status={booking.status} />
          ))}
          <Box sx={{ display: 'flex', alignItems: 'center', margin: '15px' }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Start date"
                value={bookingStart}
                onChange={(newDate) => {
                  const month = (parseInt(newDate.$M) + 1).toString()
                  const stringDate = `${newDate.$y}-${month}-${newDate.$D}`
                  setBookingStart(stringDate);
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="End date"
                value={bookingEnd}
                onChange={(newDate) => {
                  const month = (parseInt(newDate.$M) + 1).toString()
                  const stringDate = `${newDate.$y}-${month}-${newDate.$D}`
                  setBookingEnd(stringDate);
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
            <Button sx={{ height: '56px' }} variant='contained' onClick={() => {
              if (new Date(bookingEnd) - new Date(bookingStart) <= 0) {
                setInvalidAlert(true);
                return;
              }
              makeRequest(`/bookings/new/${params.lId}`, 'POST', {
                dateRange: {
                  start: bookingStart,
                  end: bookingEnd
                },
                totalPrice: price
              }, getters.token).then((res) => {
                if (!('error' in res)) {
                  const newOwnedBookings = [...ownedBookings];
                  newOwnedBookings.push({
                    dateRange: {
                      start: bookingStart,
                      end: bookingEnd
                    },
                    status: 'pending'
                  });
                  setOwnedBookings(newOwnedBookings);
                  setAlert(true);
                  setInvalidAlert(false);
                }
              })
            }}>
              Make Booking
            </Button>
            {invalidAlert && (
              <Alert severity="error">End date must be after start date!</Alert>
            )}
            {alert && (
            <Alert severity="success">Booking Made!</Alert>
            )}
          </Box>
        </Box>
      )}
      <br />
      <Button variant='contained' onClick={() => { navigate('/'); }}>
        Back to Listings
      </Button>
    </PageBox>
  );
}
