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
        let dateInterval;
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
            const availablities = queryListing.availablity
            for (let i = 0; i < availablities.length; i += 1) {
              if (availablities[i].start <= value && availablities[i].end > value) {
                dateInterval = null;
                break;
              }
              if (dateInterval === undefined || availablities[i].start < dateInterval) {
                dateInterval = availablities[i].start;
              }
            }
            if (dateInterval === null) {
              res.splice(i, 1);
              break;
            }
          } else if (key === 'endDate') {
            const availablities = queryListing.availablity
            let hasEnd;
            for (let i = 0; i < availablities.length; i += 1) {
              if (availablities[i].start < value && availablities[i].end >= value) {
                hasEnd = null;
                break;
              }
            }
            if (hasEnd === null || value > dateInterval) {
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
