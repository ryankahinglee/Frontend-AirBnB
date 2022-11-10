import React from 'react';
import PropTypes from 'prop-types'
import { ImageList, ImageListItem } from '@mui/material';

export default function ImageDisplay ({ images }) {
  // https://mui.com/material-ui/react-image-list/
  return (
    <div style={{ width: '500px', height: '500px', overflowY: 'scroll', borderStyle: 'solid' }}>
      <ImageList variant="masonry" cols={3} gap={8}>
        {images.map((item, index) => (
          <ImageListItem key={`image-${index}`}>
            <img
              src={`${item}`}
              alt={item}
              loading="lazy"
            />
          </ImageListItem>
        ))}
      </ImageList>
    </div>
  )
}

ImageDisplay.propTypes = {
  images: PropTypes.array
}
