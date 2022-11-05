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
        for (const [key, value] of Object.entries(conditions)) {
          if (key === 'title') {
            if (queryListing.title !== value) {
              res.splice(i, 1);
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
