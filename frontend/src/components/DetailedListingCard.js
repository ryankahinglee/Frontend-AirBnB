import React from 'react';
import PropTypes from 'prop-types'
import EditButton from './EditButton';
import DeleteButton from './DeleteButton';

export default function DetailedListingCard ({ title, type, bedrooms, numBathrooms, thumbnail, reviews, price, lId }) {
  // return all info in a card
  // include a delete and edit button
  // should i pass in id for that?
  const [bedCounter, setBedCounter] = React.useState(0);
  const [reviewCounter, setReviewCounter] = React.useState(0);
  const [starAmount, setStarAmount] = React.useState(0);
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
      <img alt={`listing thumbnail-${title}`} src={thumbnail}></img>
      <div>{`Price/night : ${price}`}</div>
      {/* https://www.tutorialspoint.com/How-to-draw-a-star-in-HTML5-SVG */}
      {
        (new Array(starAmount)).map((_, index) => (
          <svg key={`star-${index}`} viewBox="0 0 200 200" height="50px" width="50px">
            <polygon points="100,10 40,180 190,60 10,60 160,180"/>
          </svg>
        )
        )
      }
      <EditButton route={`/editlisting/${lId}`} desc={'Edit Listing'}/>
      <DeleteButton route={`/deletelisting/${lId}`} desc={'Delete Listing'}/>
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
  lId: PropTypes.number
}
