import React from 'react';
import { contextVariables } from '../contextVariables';
import makeRequest from '../makeRequest';
import DetailedListingCard from '../components/DetailedListingCard';
import ProfitGraph from '../components/ProfitGraph';
import { useNavigate, createSearchParams } from 'react-router-dom';

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
      setFullListings(res.map(listingPromise => listingPromise.value))
    })
  }, [])
  return (
    <div>
      {fullListings.map((listing, index) => (<>
        <DetailedListingCard
          key={`detailedListing-${index}`}
          title={listing.title}
          type={listing.metadata.type}
          bedrooms={listing.metadata.bedrooms}
          numBathrooms={parseInt(listing.metadata.bathrooms)}
          reviews={listing.reviews}
          price={parseInt(listing.price)}
          thumbnail={listing.thumbnail}
          lId={listing.id}
          listingSetter={(lId) => {
            setFullListings(fullListings.filter(listing => listing.id !== lId))
          }}
          published={listing.published}
        />
        <button onClick={ () => {
          const params = listing.postedOn
          navigate({
            pathname: `/bookingHistory/${listing.id}`,
            search: `?${createSearchParams({ params })}`,
          })
        }}>
          View Requests
        </button>
        <ProfitGraph lId={listing.id}/>
      </>))}
    </div>
  )
}
