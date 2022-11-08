import React from 'react';
import {
  useSearchParams
} from 'react-router-dom';
// import { useNavigate } from 'react-router-dom';
import { tokenContext } from '../token-context';
import makeRequest from '../makeRequest';
import ListingCard from '../components/ListingCard';

export default function AdvancedSearch () {
  const { getters } = React.useContext(tokenContext);
  const [listings, setListings] = React.useState([]);

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
            return res
          })
        }))
      }
    }).then((res) => {
      for (let i = res.length - 1; i >= 0; i -= 1) {
        const queryListing = res[i].value.listing;
        if (queryListing.availability === undefined) {
          continue;
        }
        for (const [key, value] of Object.entries(conditions)) {
          if (key === 'title' && queryListing.title !== value) {
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
            console.log(availabilities);
            let startValid = true;
            for (let i = 0; i < availabilities.length; i += 1) {
              if (new Date(value) < new Date(availabilities[i].start)) {
                startValid = false;
                break;
              }
            }
            if (startValid === false) {
              res.splice(i, 1);
              break;
            }
          } else if (key === 'endDate') {
            const availabilities = queryListing.availability
            let endValid = true;
            for (let i = 0; i < availabilities.length; i += 1) {
              if (new Date(value) > new Date(availabilities[i].end)) {
                endValid = false
                break;
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
        result.push(temp.value.listing);
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
        averageTwo = averageOne / reviewsTwo.length;
        if (conditions.sortByHighest) {
          return averageTwo - averageOne
        } else {
          return averageOne - averageTwo
        }
      })
      setListings(result);
    })
  }, [])
  return (
    <div>
      <h1> Available Listings from Advanced Search</h1>
      <hr></hr>
      {listings.map((data, index) => (
        <ListingCard key={`listing-${index}`} title={data.title} thumbnail={data.thumbnail} reviews={data.reviews}/>
      ))}
    </div>
  );
}
