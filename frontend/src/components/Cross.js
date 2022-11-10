import React from 'react';
import PropTypes from 'prop-types'

export default function Cross ({ images, imagesSetter, img }) {
  // https://riptutorial.com/svg/example/10317/draw-a-cross-using-diagonal-red-lines
  return (
    <svg
      style={{ paddingLeft: '10px', paddingBottom: '0px' }}
      viewBox="0 0 200 200"
      height="30px"
      width="30px"
      onClick={() => {
        const indexDelete = images.indexOf(img)
        const newImages = [...images]
        newImages.splice(indexDelete, 1)
        imagesSetter(newImages)
      }}
    >
        <line x1="10" y1="10" x2="100" y2="100" stroke="black" strokeWidth="10" />
        <line x1="100" y1="10" x2="10" y2="100" stroke="black" strokeWidth="10" />
    </svg>
  );
}

Cross.propTypes = {
  images: PropTypes.array,
  imagesSetter: PropTypes.func,
  img: PropTypes.string
}
