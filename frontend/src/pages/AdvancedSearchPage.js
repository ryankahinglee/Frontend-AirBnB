import React from 'react';
import {
  useSearchParams
} from 'react-router-dom';
// import { useNavigate } from 'react-router-dom';
import { contextVariables } from '../contextVariables';
import makeRequest from '../makeRequest';
import ListingCard from '../components/ListingCard';

export default function AdvancedSearch () {
  const { getters } = React.useContext(contextVariables);
  const [listings, setListings] = React.useState([]);
  const [bookings, setBookings] = React.useState([]);

  const [searchParams] = useSearchParams();
  const conditions = [];
  for (const [key, value] of searchParams.entries()) {
    if (value !== 'undefined') {
      conditions[key] = value;
    }
  }

  React.useEffect(() => {
    makeRequest('/listings', 'get', undefined, '').then((res) => {
      if (res !== undefined) {
        return Promise.allSettled(res.listings.map((listing) => {
          return makeRequest(`/listings/${listing.id}`, 'get', undefined, getters.token).then((res) => {
            return {
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
          newListings.push({ value: listing.value });
        }
      })
      return newListings;
    }).then((res) => {
      for (let i = res.length - 1; i >= 0; i -= 1) {
        const queryListing = res[i].value;
        const validStarts = [];
        if (queryListing.availability === undefined) {
          continue;
        }
        for (const [key, value] of Object.entries(conditions)) {
          if (key === 'title' && queryListing.title.toLowerCase() !== value.toLowerCase()) {
            res.splice(i, 1);
            break;
          } else if (key === 'city' && queryListing.address.city !== value) {
            res.splice(i, 1);
            break;
          } else if (key === 'minBedrooms' && queryListing.metadata.bedrooms.length < value) {
            res.splice(i, 1);
            break;
          } else if (key === 'maxBedrooms' && queryListing.metadata.bedrooms.length > value) {
            res.splice(i, 1);
            break;
          } else if (key === 'minPrice' && queryListing.price < value) {
            res.splice(i, 1);
            break;
          } else if (key === 'maxPrice' && queryListing.price > value) {
            res.splice(i, 1);
            break;
          } else if (key === 'startDate') {
            const availabilities = queryListing.availability
            let startValid = false;
            for (let i = 0; i < availabilities.length; i += 1) {
              if (new Date(value) >= new Date(availabilities[i].start)) {
                startValid = true;
                validStarts.push(i);
              }
            }
            if (startValid === false) {
              res.splice(i, 1);
              break;
            }
          } else if (key === 'endDate') {
            const availabilities = queryListing.availability
            let endValid = false;
            if (validStarts.length === 0) {
              for (let i = 0; i < availabilities.length; i += 1) {
                if (new Date(value) <= new Date(availabilities[i].end)) {
                  endValid = true
                  break;
                }
              }
            } else {
              for (let i = 0; i < validStarts.length; i += 1) {
                if (new Date(value) <= new Date(availabilities[validStarts[i]].end)) {
                  endValid = true
                  break;
                }
              }
            }
            if (endValid === false) {
              res.splice(i, 1);
              break;
            }
          }
        }
      }
      return res
    }).then((res) => {
      const result = []
      res.forEach((temp) => {
        result.push(temp.value);
      })
      // Sort listings by rating
      result.sort(function (a, b) {
        const reviewsOne = a.reviews
        const reviewsTwo = b.reviews;

        let averageOne = 0;
        reviewsOne.forEach(review => {
          averageOne += parseInt(review.rating);
        })
        averageOne = averageOne / reviewsOne.length;
        let averageTwo = 0;
        reviewsTwo.forEach(review => {
          averageTwo += parseInt(review.rating);
        })
        averageTwo = averageTwo / reviewsTwo.length;
        if (conditions.sortByHighest === 'true') {
          return averageTwo - averageOne
        } else {
          return averageOne - averageTwo
        }
      })
      setListings(result);
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
  return (
    <div>
      <h1> Available Listings from Advanced Search</h1>
      <hr></hr>
      {listings.map((data, index) => (
        <ListingCard key={`listing-${index}`} id={data.id} title={data.title} thumbnail={data.thumbnail} reviews={data.reviews} bookings={bookings}/>
      ))}
    </div>
  );
}
