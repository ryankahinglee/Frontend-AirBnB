import React from 'react';
import PropTypes from 'prop-types'

export default function Bedroom ({ type, count }) {
  // pass in bedroom anon fn setter
  // add stuff like this:
  // need delete btn too
  // Type: &nbsp;
  // <select onChange = {event => setBedroomType(event.target.value)}>
  //   {options.map((option, index) => (
  //     <option key={`bedroom-${index}`} value={option.value}>{option.label}</option>
  //   ))}
  // </select>
  // &nbsp;Number of beds:&nbsp;
  // <input
  //   type="number"
  //   name="bedCount"
  //   onChange={event => setBedCount(event.target.value)}
  //   value = {bedCount}
  // />
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
