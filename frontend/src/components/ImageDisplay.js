import React from 'react';
import PropTypes from 'prop-types'
import { ImageList, ImageListItem } from '@mui/material';

export default function ImageDisplay ({ images, thumbnail, title }) {
  // https://mui.com/material-ui/react-image-list/
  return (
    <div style={{ width: '380px', height: '300px', overflowY: 'scroll', borderStyle: 'solid' }}>
      <ImageList variant="masonry" cols={3} gap={8}>
        {images.map((item, index) => (
          <ImageListItem key={`image-${index}`}>
            <img
              src={`${item}`}
              alt={`${title}-Property Image`}
              loading="lazy"
            />
          </ImageListItem>
        ))}
        <ImageListItem>
          <img
            src={`${thumbnail}`}
            alt={`${title}-Thumbnail Image`}
            loading="lazy"
          />
        </ImageListItem>
      </ImageList>
    </div>
  );
}

ImageDisplay.propTypes = {
  images: PropTypes.array,
  thumbnail: PropTypes.string,
  title: PropTypes.string
}
