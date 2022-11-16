<<<<<<< HEAD
import React from 'react';
import PropTypes from 'prop-types'

export default function ImageDeleteButton ({ images, imagesSetter, img }) {
  // https://riptutorial.com/svg/example/10317/draw-a-cross-using-diagonal-red-lines
  return (
    <svg
      style={{ padding: '10px' }}
      viewBox="0 0 100 100"
      height="20  px"
      width="20px"
      onClick={() => {
        const indexDelete = images.indexOf(img);
        const newImages = [...images];
        newImages.splice(indexDelete, 1);
        imagesSetter(newImages);
      }}
    >
      <line x1="10" y1="10" x2="100" y2="100" stroke="black" strokeWidth="10" />
      <line x1="100" y1="10" x2="10" y2="100" stroke="black" strokeWidth="10" />
    </svg>
  );
}

ImageDeleteButton.propTypes = {
  images: PropTypes.array,
  imagesSetter: PropTypes.func,
  img: PropTypes.string
}
=======
import React from 'react';
import PropTypes from 'prop-types'

export default function ImageDeleteButton ({ images, imagesSetter, img }) {
  // https://riptutorial.com/svg/example/10317/draw-a-cross-using-diagonal-red-lines
  return (
    <svg
      style={{ paddingLeft: '10px', paddingBottom: '0px' }}
      viewBox="0 0 200 200"
      height="30px"
      width="30px"
      onClick={() => {
        const indexDelete = images.indexOf(img);
        const newImages = [...images];
        newImages.splice(indexDelete, 1);
        imagesSetter(newImages);
      }}
    >
      <line x1="10" y1="10" x2="100" y2="100" stroke="black" strokeWidth="10" />
      <line x1="100" y1="10" x2="10" y2="100" stroke="black" strokeWidth="10" />
    </svg>
  );
}

ImageDeleteButton.propTypes = {
  images: PropTypes.array,
  imagesSetter: PropTypes.func,
  img: PropTypes.string
}
>>>>>>> c80a694d5063cf80df616797bc0cee681422cdfa
