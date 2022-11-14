import React from 'react';
import '../App.css';
import {
  useNavigate,
  createSearchParams
} from 'react-router-dom';
import makeRequest from '../makeRequest';

import ListingCard from '../components/ListingCard';
import SearchFilter from '../components/SearchFilter';
import { Box, TextField } from '@mui/material'

import { contextVariables } from '../contextVariables';
import { styled } from '@mui/system';

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

  const ListingBox = styled(Box)({
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: '0px 20px',
    justifyContent: 'flex-start'
  })

  const ListingTitle = styled('h1')({
    color: '#286ee6',
    margin: '0px'
  })

  return (
    <div>
      <Box style={{ display: 'flex', justifyContent: 'center', margin: '10px', height: '56px' }}>
        <TextField
          label="Search by Title"
          type="search"
          style = {{
            height: '56px'
          }}
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
        />
        <SearchFilter />
      </Box>
      {getters.token === '' && (<div>
        <ListingTitle> Available Listings </ListingTitle>
        <ListingBox>
          {currentListings.map((data, index) => (
            <ListingCard key={`listing-${index}`} id={data.id} title={data.title} thumbnail={data.thumbnail} reviews={data.reviews} bookings={bookings}/>
          ))}
        </ListingBox>
      </div>)}
      {getters.token !== '' && (<div>
        {acceptedListings.length !== 0 && (
          <ListingTitle> Accepted Listings </ListingTitle>
        )}
        <ListingBox>
          {acceptedListings.map((data, index) => (
            <ListingCard key={`listing-${index}`} id={data.id} title={data.title} thumbnail={data.thumbnail} reviews={data.reviews} bookings={bookings}/>
          ))}
        </ListingBox>
        {pendingListings.length !== 0 && (
          <ListingTitle> Pending Listings </ListingTitle>
        )}
        <ListingBox>
          {pendingListings.map((data, index) => (
            <ListingCard key={`listing-${index}`} id={data.id} title={data.title} thumbnail={data.thumbnail} reviews={data.reviews} bookings={bookings}/>
          ))}
        </ListingBox>
        {remainingListings.length !== 0 && (
          <ListingTitle> Available Listings </ListingTitle>
        )}
        <ListingBox>
          {remainingListings.map((data, index) => (
            <ListingCard key={`listing-${index}`} id={data.id} title={data.title} thumbnail={data.thumbnail} reviews={data.reviews} bookings={bookings}/>
          ))}
        </ListingBox>
      </div>)}
    </div>
  )
}
