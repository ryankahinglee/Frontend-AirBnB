import React from 'react';
import PropTypes from 'prop-types'
import EditButton from './EditButton';
import DeleteButton from './DeleteButton';
import AvailabilityEdit from './AvailabilityEdit';
import makeRequest from '../makeRequest';
import { contextVariables } from '../contextVariables';
import Star from './Star';

export default function DetailedListingCard ({ title, type, bedrooms, numBathrooms, thumbnail, reviews, price, lId, listingSetter, published }) {
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
  }, [])
  // calculate actual rating for SVG
  return (
    <div>
      <div>{`Title: ${title}`}</div>
      <div>{`Property Type: ${type}`}</div>
      <div>{`Number of beds: ${bedCounter}`}</div>
      <div>{`Number of Reviews: ${reviewCounter}`}</div>
      <div>{`Rating: ${starAmount}`}</div>
      <div>{`Number of Bathrooms: ${numBathrooms}`}</div>
      <img style={{ height: '50px', width: '50px' }} alt={`listing thumbnail-${title}`} src={thumbnail}></img>
      <div>{`Price/night : ${price}`}</div>
      {
        (new Array(starAmount)).map((_, index) => (
          <Star key={`star-${index}`}/>
        )
        )
      }
      {/* pass in ID, not route */}
      <EditButton lId={lId} desc={'Edit Listing'} />
      <DeleteButton lId={lId} desc={'Delete Listing'} listingSetter={listingSetter} />
      {!publishStatus && (
        <AvailabilityEdit lId={lId} desc={'Set Availabilities'} />
      )}
      {publishStatus && (
        <button onClick={() => {
          makeRequest(`/listings/unpublish/${lId}`, 'put', undefined, getters.token).then((res) => {
            setPublishStatus(false)
          })
        }}>
          Unpublish Listing
        </button>
      )}
    </div>
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
