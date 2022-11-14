import React from 'react';
import PropTypes from 'prop-types'
import EditButton from './EditButton';
import DeleteButton from './DeleteButton';
import AvailabilityEdit from './AvailabilityEdit';
import makeRequest from '../makeRequest';
import { contextVariables } from '../contextVariables';
import { Button, Box } from '@mui/material';
import Star from './Star';

export default function DetailedListingCard ({ title, type, bedrooms, numBathrooms, thumbnail, reviews, price, lId, listingSetter, published, fullListings }) {
  const [bedCounter, setBedCounter] = React.useState(0);
  const [reviewCounter, setReviewCounter] = React.useState(0);
  const [starAmount, setStarAmount] = React.useState(0);
  const [publishStatus, setPublishStatus] = React.useState(published);
  const { getters } = React.useContext(contextVariables);
  const [isVideo, setIsVideo] = React.useState(false);
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
    if (thumbnail.includes('www.youtube.com/embed/')) {
      setIsVideo(true);
    }
  }, [fullListings])
  return (
    <Box style={{
      border: 'solid',
      borderWidth: '0.1px',
      borderColor: '#6392e3',
      padding: '5px',
    }}>
      {!isVideo && (
        <img style={{ height: '300px', width: '370px', display: 'inline-block' }} alt={`listing thumbnail-${title}`} src={thumbnail}></img>
      )}
      {isVideo && (
        <iframe style={{ height: '200px', width: '400px' }} src={thumbnail}/>
      )}
      <div>{`Title: ${title}`}</div>
      <div>{`Property Type: ${type}`}</div>
      <div>{`Number of beds: ${bedCounter}`}</div>
      <div>{`Number of Reviews: ${reviewCounter}`}</div>
      <div>{`Rating: ${starAmount}`}</div>
      <div>{`Number of Bathrooms: ${numBathrooms}`}</div>
      <div>{`Price/night : ${price}`}</div>
      {
        (new Array(starAmount)).map((_, index) => (
          <Star key={`star-${index}`}/>
        )
        )
      }
      {/* pass in ID, not route */}
      <Box style={{ display: 'flex', justifyContent: 'center', padding: '5px 0px 0px 0px' }}>
        <EditButton lId={lId} desc={'Edit'} />
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
        <DeleteButton lId={lId} desc={'Delete'} listingSetter={listingSetter} />
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
