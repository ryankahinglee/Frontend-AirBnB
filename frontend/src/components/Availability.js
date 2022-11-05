import React from 'react';
import PropTypes from 'prop-types'
export default function Availability ({ start, end, availStartSetter, availEndSetter, availDelete }) {
  return (
    <div>
      <input
        type="date"
        name="startDate"
        onChange={event => {
          availStartSetter(event.target.value)
        }}
        value={start}
      />
      <input
        type="date"
        name="endDate"
        onChange={event => {
          availEndSetter(event.target.value)
        }}
        value={end}
      />
      <button onClick={availDelete}>
        Remove Date Range
      </button>
    </div>
  );
}
Availability.propTypes = {
  start: PropTypes.string,
  end: PropTypes.string,
  availStartSetter: PropTypes.func,
  availEndSetter: PropTypes.func,
  availDelete: PropTypes.func
}
