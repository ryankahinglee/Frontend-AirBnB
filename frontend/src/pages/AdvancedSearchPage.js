import React from 'react';
import {
  useSearchParams
} from 'react-router-dom';
// import { useNavigate } from 'react-router-dom';
import { contextVariables } from '../helpers/contextVariables';
import makeRequest from '../helpers/makeRequest';
import ListingCard from '../components/ListingCard';
import { Box } from '@mui/material';
import { styled } from '@mui/system';

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
            };
          });
        }));
      }
    }).then((res) => {
      const newListings = [];
      res.forEach((listing) => {
        if (listing.value.published === true) {
          newListings.push({ value: listing.value });
        }
      });
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
            const lowerCaseTitle = queryListing.title.toLowerCase();
            const subStrings = (value.toLowerCase()).split(/\s+/);
            let containsString = false;
            subStrings.forEach((string) => {
              if (lowerCaseTitle.includes(string)) {
                containsString = true;
              }
            })
            if (containsString === false) {
              res.splice(i, 1);
              break;
            }
          } else if (key === 'city' && queryListing.address.city !== value.toLowerCase()) {
            const lowerCaseCity = queryListing.address.city.toLowerCase();
            const subStrings = (value.toLowerCase()).split(/\s+/);
            let containsString = false;
            subStrings.forEach((string) => {
              if (lowerCaseCity.includes(string)) {
                containsString = true;
              }
            })
            if (containsString === false) {
              res.splice(i, 1);
              break;
            }
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
            const availabilities = queryListing.availability;
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
            const availabilities = queryListing.availability;
            let endValid = false;
            if (validStarts.length === 0) {
              for (let i = 0; i < availabilities.length; i += 1) {
                if (new Date(value) <= new Date(availabilities[i].end)) {
                  endValid = true;
                  break;
                }
              }
            } else {
              for (let i = 0; i < validStarts.length; i += 1) {
                if (new Date(value) <= new Date(availabilities[validStarts[i]].end)) {
                  endValid = true;
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
      return res;
    }).then((res) => {
      const result = []
      res.forEach((temp) => {
        result.push(temp.value);
      });
      result.sort(function (a, b) {
        const reviewsOne = a.reviews
        const reviewsTwo = b.reviews;

        let averageOne = 0;
        reviewsOne.forEach(review => {
          averageOne += parseInt(review.rating);
        })
        if (reviewsOne.length !== 0) {
          averageOne = averageOne / reviewsOne.length;
        }
        let averageTwo = 0;
        reviewsTwo.forEach(review => {
          averageTwo += parseInt(review.rating);
        })
        if (reviewsTwo.length !== 0) {
          averageTwo = averageTwo / reviewsTwo.length;
        }
        if (conditions.sortByHighest === 'true') {
          return averageTwo - averageOne
        } else {
          return averageOne - averageTwo
        }
      });
      setListings(result);
    }).then(() => {
      if (getters.token !== '') {
        makeRequest('/bookings', 'get', undefined, getters.token).then((res) => {
          if (res !== undefined) {
            setBookings(res.bookings)
          }
        });
      }
    });
  }, []);

  const ListingTitle = styled('h1')({
    color: '#286ee6',
    margin: '10px'
  });

  const ListingBox = styled(Box)({
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: '0px 20px',
    justifyContent: 'space-between'
  });
  return (
    <div>
      <ListingTitle> Available Listings from Advanced Search</ListingTitle>
      <ListingBox>
        {listings.map((data, index) => (
          <ListingCard key={`listing-${index}`} id={data.id} title={data.title} thumbnail={data.thumbnail} reviews={data.reviews} bookings={bookings} />
        ))}
      </ListingBox>
    </div>
  );
}
