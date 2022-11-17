import React from 'react';
import PropTypes from 'prop-types'
import EditListingButton from './EditListingButton';
import DeleteListingButton from './DeleteListingButton';
import AvailabilityEdit from './AvailabilityEdit';
import makeRequest from '../helpers/makeRequest';
import { contextVariables } from '../helpers/contextVariables';
import { Button, Box } from '@mui/material';
import { styled } from '@mui/system';
import Star from './Star';

// This component lists a large amount of information regarding a listing and is shown on the hosted listings page
export default function DetailedListingCard ({ title, type, bedrooms, numBathrooms, thumbnail, reviews, price, lId, listingSetter, published }) {
  const [publishStatus, setPublishStatus] = React.useState(published);
  const { getters } = React.useContext(contextVariables);
  let bedNum = 0;
  for (const bedroom of bedrooms) {
    bedNum += parseInt(bedroom.numBeds)
  }
  let ratingSum = 0;
  for (const review of reviews) {
    ratingSum += parseInt(review.rating)
  }
  let starAmount = 0;
  if (reviews.length !== 0) {
    starAmount = Math.round(ratingSum / reviews.length);
  }
  const DetailLabel = styled('span')({
    color: '#286ee6'
  })
  return (
    <Box style={{
      border: 'solid',
      borderWidth: '0.1px',
      borderColor: '#6392e3',
      padding: '5px',
    }}>
      <img style={{ height: '300px', width: '370px', display: 'inline-block' }} alt={`listing thumbnail-${title}`} src={thumbnail}></img>
      <p>
        <DetailLabel>Title: </DetailLabel>
        <span name='title-listing'>{`${title}`}</span>
      </p>
      <p>
        <DetailLabel>Property Type:</DetailLabel>{` ${type}`}
      </p>
      <p>
        <DetailLabel>Number of beds:</DetailLabel>{` ${bedNum}`}
      </p>
      <p>
        <DetailLabel>Number of Bathrooms:</DetailLabel>{` ${numBathrooms}`}
      </p>
      <p>
        <DetailLabel>Price per Night:</DetailLabel>{` ${price}`}
      </p>
      <p>
        <DetailLabel>Number of Reviews:</DetailLabel>{` ${reviews.length}`}
      </p>
      {starAmount > 0 && (
        <p>
          <DetailLabel>Rating:</DetailLabel>{` ${starAmount}`}
        </p>
      )}
      {starAmount === 0 && (
        <p>
          <DetailLabel>Not Rated</DetailLabel>
        </p>
      )}
      {starAmount > 0 && (new Array(starAmount).fill(0)).map((_, index) =>
        (<Star key={`star-${index}`}
        />)
      )}
      <Box style={{ display: 'flex', justifyContent: 'center', padding: '5px 0px 0px 0px' }}>
        <EditListingButton lId={lId} desc={'Edit'} />
        {!publishStatus && (
          <AvailabilityEdit lId={lId} desc={'Publish Listing'} />
        )}
        {publishStatus && (
          <Button variant='outlined' name='unpublish-button' onClick={() => {
            makeRequest(`/listings/unpublish/${lId}`, 'put', undefined, getters.token).then((res) => {
              setPublishStatus(false)
            })
          }}>
            Unpublish
          </Button>
        )}
        <DeleteListingButton lId={lId} desc={'Delete'} listingSetter={listingSetter} />
      </Box>

    </Box>
  );
}
DetailedListingCard.propTypes = {
  title: PropTypes.string,
  thumbnail: PropTypes.string,
  reviews: PropTypes.array,
  type: PropTypes.string,
  bedrooms: PropTypes.array,
  numBathrooms: PropTypes.number,
  price: PropTypes.number,
  lId: PropTypes.number,
  listingSetter: PropTypes.func,
  published: PropTypes.bool
}
