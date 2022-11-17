import React from 'react';
import { contextVariables } from '../helpers/contextVariables';
import makeRequest from '../helpers/makeRequest';
import DetailedListingCard from '../components/DetailedListingCard';
import ProfitGraph from '../components/ProfitGraph';
import { useNavigate, createSearchParams } from 'react-router-dom';
import { styled } from '@mui/system';
// From material ui
import { Box, Button } from '@mui/material';

// This page displays hosted listings and has buttons allowing for editing, publish/unpublish, viewing requests and the profit graph

export default function HostedListing () {
  const { getters } = React.useContext(contextVariables);
  const [fullListings, setFullListings] = React.useState([]);
  const navigate = useNavigate();
  React.useEffect(() => {
    makeRequest('/listings', 'get', undefined, '').then((res) => {
      if (res !== undefined) {
        return Promise.allSettled(res.listings.filter(listing => listing.owner === getters.owner).map((listing) => {
          return makeRequest(`/listings/${listing.id}`, 'get', undefined, getters.token).then((res) => {
            return {
              id: listing.id,
              ...res.listing
            }
          })
        }))
      }
    }).then((res) => {
      setFullListings(res.map(listingPromise => listingPromise.value));
    })
  }, [])

  const ListingTitle = styled('h1')({
    color: '#286ee6',
    margin: '10px'
  });

  const HostedBox = styled(Box)({
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    margin: '10px',
    justifyContent: 'center'
  });

  const ProfitBox = styled(Box)({
    border: 'solid',
    borderColor: '#6392e3',
    width: '370px',
    borderWidth: '0.1px',
    padding: '5px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    textAlign: 'center'
  })

  const ListingBox = styled(Box)({
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    margin: '10px 10px'
  })
  return (
    <div>
      <ListingTitle>My Listings</ListingTitle>
      <HostedBox>
        {fullListings.map((listing, index) => (
          <ListingBox key={`fullListing-${index}`} name='hosted-listing'>
            <DetailedListingCard
              title={listing.title}
              type={listing.metadata.type}
              bedrooms={listing.metadata.bedrooms}
              numBathrooms={parseInt(listing.metadata.bathrooms)}
              reviews={listing.reviews}
              price={parseInt(listing.price)}
              thumbnail={listing.thumbnail}
              lId={listing.id}
              listingSetter={(lId) => {
                setFullListings(fullListings.filter(listing => listing.id !== lId));
              }}
              published={listing.published}
            />
            <ProfitBox>
              <h2 style={{ color: '#286ee6' }}>Profit margins</h2>
              <ProfitGraph lId={listing.id} />
              <Button variant='outlined' name='view-requests-button' onClick={() => {
                const params = listing.postedOn
                navigate({
                  pathname: `/bookingHistory/${listing.id}`,
                  search: `?${createSearchParams({ params })}`,
                })
              }}>
                View Requests
              </Button>
            </ProfitBox>
          </ListingBox>
        ))}
      </HostedBox>
    </div>
  )
}
