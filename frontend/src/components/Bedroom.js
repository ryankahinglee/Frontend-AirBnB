import React from 'react';
import PropTypes from 'prop-types'

export default function Bedroom ({ type, count }) {
  return (
    <div>
      <div>{type}</div>
      <div>{count}</div>
    </div>
  );
}

Bedroom.propTypes = {
  type: PropTypes.string,
  count: PropTypes.number
}
