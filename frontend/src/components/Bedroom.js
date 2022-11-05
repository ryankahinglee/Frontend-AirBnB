import React from 'react';
import PropTypes from 'prop-types'

export default function Bedroom ({ bedroomType, bedCount, options, onBedroomTypeChange, onBedCountChange, bedroomDelete }) {
  // pass in bedroom anon fn setter
  // add stuff like this:
  // need delete btn too
  return (
    <div>
      {/* <div>{type}</div>
      <div>{count}</div> */}
      Type: &nbsp;
      <select
        value={bedroomType}
        onChange={event => {
          onBedroomTypeChange(event.target.value)
        }}
      >
        {options.map((option, index) => (
          <option key={`bedroom-${index}`} value={option.value}>{option.label}</option>
        ))}
      </select>
      &nbsp;Number of beds:&nbsp;
      <input
        type="number"
        name="bedCount"
        onChange={event => {
          onBedCountChange(event.target.value)
        }}
        value={bedCount}
      />
      <button onClick={bedroomDelete}>
        Remove Bedroom
      </button>
    </div>
  );
}

Bedroom.propTypes = {
  bedroomType: PropTypes.string,
  bedCount: PropTypes.number,
  options: PropTypes.array,
  onBedCountChange: PropTypes.func,
  onBedroomTypeChange: PropTypes.func,
  bedroomDelete: PropTypes.func
}
