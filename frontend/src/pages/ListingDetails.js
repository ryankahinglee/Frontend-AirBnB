import React from 'react';
import { ownerContext } from '../ownerContext';
import { tokenContext } from '../token-context';
import { useNavigate, useParams } from 'react-router-dom';
import makeRequest from '../makeRequest';
import Review from '../components/Review';
import Booking from '../components/Booking';

export default function ListingDetails () {
  // to implement booking status if logged in and made booking. (display all booking statuses if more than one)
  const { ownerGetter } = React.useContext(ownerContext);
  const { getters } = React.useContext(tokenContext);
  const params = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = React.useState('');
  const [address, setAddress] = React.useState('');
  const [amenities, setAmenities] = React.useState('');
  // const [price, setPrice] = React.useState(0);
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
  React.useEffect(() => {
    makeRequest(`/listings/${params.lId}`, 'get', undefined, '').then((res) => {
      const listing = res.listing
      setTitle(listing.title)
      // have to dynamically add address depending on what was entered
      setAddress(`${listing.address.streetDetails}, ${listing.address.city}, ${listing.address.state}, ${listing.address.postcode}, ${listing.address.country}`)
      setAmenities(listing.metadata.amenities)
      // setPrice(listing.price)
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
          setOwnedBookings(bookings.filter(booking => booking.owner === ownerGetter.owner))
        }
      })
    }
  }, [])

  return (
    <div>
      <div>{`Title: ${title}`}</div>
      <div>{`Address: ${address}`}</div>
      <div>{`Amenities: ${amenities}`}</div>
      {/* price per stay vs per night */}
      <div>{`Rating: ${rating}`}</div>
      {
        (new Array(rating)).map((_, index) => (
          <svg key={`star-${index}`} viewBox="0 0 200 200" height="50px" width="50px">
            <polygon points="100,10 40,180 190,60 10,60 160,180" />
          </svg>
        )
        )
      }
      <div>{`Property Type: ${type}`}</div>
      <div>{`Number of bedrooms: ${numBedrooms}`}</div>
      <div>{`Number of beds: ${numBeds}`}</div>
      <div>{`Number of Bathrooms: ${numBathrooms}`}</div>
      <div> Property Images </div>
      {images.map((img, index) => (
        <img key={`review-${index}`} src={img.src}/>
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
              totalPrice: 0
            }, getters.token)
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
