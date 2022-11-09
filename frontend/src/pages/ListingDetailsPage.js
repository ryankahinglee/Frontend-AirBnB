import React from 'react';
import { contextVariables } from '../contextVariables';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import makeRequest from '../makeRequest';
import Review from '../components/Review';
import Booking from '../components/Booking';
import Star from '../components/Star';

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
  const [rating, setRating] = React.useState(0);
  const [numBedrooms, setNumBedrooms] = React.useState(0);
  const [numBeds, setNumBeds] = React.useState(0);
  const [numBathrooms, setNumBathrooms] = React.useState(0);
  const [ownedBookings, setOwnedBookings] = React.useState([]);
  const date = new Date();
  const dateString = date.toISOString().split('T')[0]
  const [bookingStart, setBookingStart] = React.useState(dateString);
  const [bookingEnd, setBookingEnd] = React.useState(dateString);
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
  }, [])
  return (
    <div>
      <div>{`Title: ${title}`}</div>
      <div>{`Address: ${address}`}</div>
      <div>{`Amenities: ${amenities}`}</div>
      { perStay && (
        <div>{`Price per Stay: ${price}`}</div>
      )}
      { perStay === false && (
        <div>{`Price per Night: ${price}`}</div>
      )}
      <div>{`Rating: ${rating}`}</div>
      {
        (new Array(rating)).map((_, index) => (
          <Star key={`star-${index}`}/>
        )
        )
      }
      <div>{`Property Type: ${type}`}</div>
      <div>{`Number of bedrooms: ${numBedrooms}`}</div>
      <div>{`Number of beds: ${numBeds}`}</div>
      <div>{`Number of Bathrooms: ${numBathrooms}`}</div>
      <div> Property Images </div>
      {images.map((img, index) => (
        <img style={{ height: '50px', width: '50px' }} key={`image-${index}`} src={img}/>
      ))}
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
