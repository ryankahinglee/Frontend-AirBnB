import React from 'react';
import '../App.css';
import {
  useNavigate,
  createSearchParams
} from 'react-router-dom';
import makeRequest from '../makeRequest';

import ListingCard from '../components/ListingCard';
import SearchFilter from '../components/SearchFilter';

import { contextVariables } from '../contextVariables';

export default function Home () {
  // Landing screen, list airbnbs here
  const [listings, setListings] = React.useState([]);
  const [bookings, setBookings] = React.useState([]);
  const { getters } = React.useContext(contextVariables);
  const [title, setTitle] = React.useState('');
  const navigate = useNavigate();

  React.useEffect(() => {
    makeRequest('/listings', 'get', undefined, '').then((res) => {
      if (res !== undefined) {
        return Promise.allSettled(res.listings.map((listing) => {
          return makeRequest(`/listings/${listing.id}`, 'get', undefined, getters.token).then((res) => {
            return {
              published: res.listing.published,
              id: listing.id,
              ...res.listing
            }
          })
        }))
      }
    }).then((res) => {
      const newListings = [];
      res.forEach((listing) => {
        if (listing.value.published === true) {
          newListings.push(listing.value);
        }
      })
      setListings(newListings)
    }).then(() => {
      if (getters.token !== '') {
        makeRequest('/bookings', 'get', undefined, getters.token).then((res) => {
          if (res !== undefined) {
            setBookings(res.bookings)
          }
        })
      }
    })
  }, [])
  // Sort listings via alphabetic sorting
  const currentListings = listings;
  if (currentListings.length > 1) {
    currentListings.sort(function (a, b) {
      const stringTwo = b.title.toLowerCase();
      const stringOne = a.title.toLowerCase();
      return stringOne.localeCompare(stringTwo);
    })
  }
  // Sort listings by Accepted, Pending, and None
  const acceptedListings = [];
  const pendingListings = [];
  const remainingListings = [];
  if (getters.token !== '') {
    currentListings.forEach((listing) => {
      let hasStatus = false;
      for (let i = 0; i < bookings.length; i += 1) {
        if (bookings[i].owner === getters.owner && bookings[i].listingId === listing.id.toString()) {
          if (bookings[i].status === 'accepted') {
            acceptedListings.push(listing);
            hasStatus = true;
            break;
          } else if (bookings[i].status === 'pending') {
            pendingListings.push(listing);
            hasStatus = true;
            break;
          }
        }
      }
      if (hasStatus === false) {
        remainingListings.push(listing);
      }
    })
  }
  return (
    <div>
      <div>
        <form>
          <input type='text'
            placeholder='Search by Title'
            onChange = {event => setTitle(event.target.value)}
            onKeyPress = {event => {
              if (event.key === 'Enter') {
                event.preventDefault();
                const sortByHighest = true;
                const params = { title, sortByHighest }
                navigate({
                  pathname: '/advancedSearch',
                  search: `?${createSearchParams(params)}`,
                });
              }
            }}
          ></input>
        </form>
      </div>
      <SearchFilter />
      {getters.token === '' && (<div>
        <h1> Available Listings </h1>
        <hr></hr>
        {currentListings.map((data, index) => (
          <ListingCard key={`listing-${index}`} id={data.id} title={data.title} thumbnail={data.thumbnail} reviews={data.reviews} bookings={bookings}/>
        ))}
      </div>)}
      {getters.token !== '' && (<div>
        <h1> Accepted Listings </h1>
        <hr></hr>
        {acceptedListings.map((data, index) => (
          <ListingCard key={`listing-${index}`} id={data.id} title={data.title} thumbnail={data.thumbnail} reviews={data.reviews} bookings={bookings}/>
        ))}
        <h1> Pending Listings </h1>
        <hr></hr>
        {pendingListings.map((data, index) => (
          <ListingCard key={`listing-${index}`} id={data.id} title={data.title} thumbnail={data.thumbnail} reviews={data.reviews} bookings={bookings}/>
        ))}
        <h1> Available Listings </h1>
        <hr></hr>
        {remainingListings.map((data, index) => (
          <ListingCard key={`listing-${index}`} id={data.id} title={data.title} thumbnail={data.thumbnail} reviews={data.reviews} bookings={bookings}/>
        ))}
      </div>)}
    </div>
  )
}
