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

export default function DetailedListingCard ({ title, type, bedrooms, numBathrooms, thumbnail, reviews, price, lId, listingSetter, published, fullListings }) {
  const [bedCounter, setBedCounter] = React.useState(0);
  const [reviewCounter, setReviewCounter] = React.useState(0);
  const [starAmount, setStarAmount] = React.useState(0);
  const [publishStatus, setPublishStatus] = React.useState(published);
  const { getters } = React.useContext(contextVariables);
  React.useEffect(() => {
    let bedNum = 0
    for (const bedroom of bedrooms) {
      bedNum += parseInt(bedroom.numBeds)
    }
    setBedCounter(bedNum)
    setReviewCounter(reviews.length)
    let ratingSum = 0
    for (const review of reviews) {
      ratingSum += parseInt(review.rating)
    }
    if (reviews.length !== 0) {
      setStarAmount(Math.round(ratingSum / reviews.length))
    }
  }, [fullListings])
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
        <DetailLabel>Title:</DetailLabel>{` ${title}`}
      </p>
      <p>
        <DetailLabel>Property Type:</DetailLabel>{` ${type}`}
      </p>
      <p>
        <DetailLabel>Number of beds:</DetailLabel>{` ${bedCounter}`}
      </p>
      <p>
        <DetailLabel>Number of Bathrooms:</DetailLabel>{` ${numBathrooms}`}
      </p>
      <p>
        <DetailLabel>Price per Night:</DetailLabel>{` ${price}`}
      </p>
      <p>
        <DetailLabel>Number of Reviews:</DetailLabel>{` ${reviewCounter}`}
      </p>
      <p>
        <DetailLabel>Rating:</DetailLabel>{` ${starAmount}`}
      </p>
      {(new Array(starAmount).fill(0)).map((_, index) =>
        (<Star key={`star-${index}`}
        />)
      )}
      <Box style={{ display: 'flex', justifyContent: 'center', padding: '5px 0px 0px 0px' }}>
        <EditListingButton lId={lId} desc={'Edit'} />
        {!publishStatus && (
          <AvailabilityEdit lId={lId} desc={'Publish Listing'} />
        )}
        {publishStatus && (
          <Button variant='outlined' onClick={() => {
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
  published: PropTypes.bool,
  fullListings: PropTypes.array
}
