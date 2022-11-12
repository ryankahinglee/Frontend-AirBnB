import React from 'react';
import { contextVariables } from '../contextVariables';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import makeRequest from '../makeRequest';
import Review from '../components/Review';
import Booking from '../components/Booking';
import Star from '../components/Star';
import ImageDisplay from '../components/ImageDisplay';
// https://v4.mui.com/components/tooltips/#simple-tooltips
import { Tooltip } from '@mui/material';
import SpecificRatingReviews from '../components/SpecificRatingReviews';

export default function ListingDetails () {
  const { getters } = React.useContext(contextVariables);
  const params = useParams();
  const navigate = useNavigate();
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
  const date = new Date();
  const dateString = date.toISOString().split('T')[0]
  const [bookingStart, setBookingStart] = React.useState(dateString);
  const [bookingEnd, setBookingEnd] = React.useState(dateString);
  const [openReview, setOpenReview] = React.useState(false);
  const [searchParams] = useSearchParams();
  React.useEffect(() => {
    makeRequest(`/listings/${params.lId}`, 'get', undefined, '').then((res) => {
      const listing = res.listing
      setTitle(listing.title)
      // have to dynamically add address depending on what was entered
      setAddress(`${listing.address.streetDetails}, ${listing.address.city}, ${listing.address.state}, ${listing.address.postcode}, ${listing.address.country}`)
      setAmenities(listing.metadata.amenities)
      // setPrice(listing.price)
      const conditions = [];
      for (const [key, value] of searchParams.entries()) {
        if (value !== 'undefined') {
          conditions[key] = value;
        }
      }
      // Using general code of finding difference between two date objects in days
      let difference = new Date(conditions.endDate).getTime() - new Date(conditions.startDate).getTime();
      difference = Math.ceil(difference / (1000 * 3600 * 24))
      if (difference > 0) {
        setPrice(difference * listing.price)
        setPerStay(true);
      } else {
        setPrice(listing.price)
      }
      setImages(listing.metadata.images)
      setType(listing.metadata.type)
      setReviews(listing.reviews)
      let ratingSum = 0
      for (const review of listing.reviews) {
        ratingSum += parseInt(review.rating)
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
        setRating(Math.round(ratingSum / listing.reviews.length))
      }
      setNumBedrooms(listing.metadata.bedrooms.length)
      let bedNum = 0
      for (const bedroom of listing.metadata.bedrooms) {
        bedNum += parseInt(bedroom.numBeds)
      }
      setNumBeds(bedNum)
      setNumBathrooms(listing.metadata.bathrooms)
    })
    if (getters.token !== '') {
      makeRequest('/bookings', 'get', undefined, getters.token).then((res) => {
        const bookings = res.bookings
        if (bookings.length !== 0) {
          setOwnedBookings(bookings.filter(booking => booking.owner === getters.owner))
        }
      })
    }
    const temp = <SpecificRatingReviews />
    console.log(temp)
    console.log(openReview);
  }, [])
  return (
    <div>
      <SpecificRatingReviews state={openReview} stateSetter={setOpenReview} reviews={reviews} rating={reviewRatingFilter}/>
      <div>{`Title: ${title}`}</div>
      <div>{`Address: ${address}`}</div>
      <div>{`Amenities: ${amenities}`}</div>
      { perStay && (
        <div>{`Price per Stay: ${price}`}</div>
      )}
      { perStay === false && (
        <div>{`Price per Night: ${price}`}</div>
      )}
      <Tooltip
        title={
          <React.Fragment>
            {
              reviewsBreakdown.map((review, index) => (
                <div
                  key={`review-${index}`}
                  onClick = {() => {
                    setOpenReview(!openReview)
                    setReviewRatingFilter(review.rating)
                  }}
                >
                  {`${review.rating} stars: ${review.count} ratings, ${review.percentage}% of ratings `}
                </div>
              ))
            }
          </React.Fragment>
        }
        placement="bottom"
      >
        <div>
          <div>{`Rating: ${rating}`}</div>
          {
            (new Array(rating).fill(0)).map((_, index) => (
              <Star key={`star-${index}`}/>
            )
            )
          }
        </div>
      </Tooltip>
      <div>{`Property Type: ${type}`}</div>
      <div>{`Number of bedrooms: ${numBedrooms}`}</div>
      <div>{`Number of beds: ${numBeds}`}</div>
      <div>{`Number of Bathrooms: ${numBathrooms}`}</div>
      <div> Property Images </div>
      {/* {images.map((img, index) => (
        <img style={{ height: '50px', width: '50px' }} key={`image-${index}`} src={img}/>
      ))} */}
      {images.length !== 0 && (
        <ImageDisplay images={images}/>
      )}
      <div> Listing Reviews </div>
      {reviews.map((rev, index) => (
        <Review key={`review-${index}`} rating={rev.rating} comment={rev.comment}/>
      ))}
      {getters.token !== '' && (
        <div> My bookings </div>
      )}
      {getters.token !== '' && (
        ownedBookings.map((booking, index) => (
        <Booking
          key={`booking-${index}`}
          dateRange={booking.dateRange}
          status={booking.status}/>
        ))
      )}
      {getters.token !== '' && (
        <div>
          <input
          type="date"
          name="startDate"
          onChange={event => setBookingStart(event.target.value)}
          value={bookingStart}
          />
          <input
            type="date"
            name="endDate"
            onChange={event => setBookingEnd(event.target.value)}
            value={bookingEnd}
          />
          <button onClick={() => {
            makeRequest(`/bookings/new/${params.lId}`, 'POST', {
              dateRange: {
                start: bookingStart,
                end: bookingEnd
              },
              totalPrice: price
            }, getters.token).then((res) => {
              if (!('error' in res)) {
                alert('Booking made!')
              }
            })
          }}>
            Make Booking
          </button>
        </div>
      )}
      <button onClick={() => { navigate('/') }}>
        Back to Listings
      </button>
    </div>
  );
}
