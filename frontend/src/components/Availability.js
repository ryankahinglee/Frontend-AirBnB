import React from 'react';
import PropTypes from 'prop-types'
export default function Availability ({ start, end, availStartSetter, availEndSetter, availDelete }) {
  const [startDate, setStartDate] = React.useState(start);
  const [endDate, setEndDate] = React.useState(end);
  return (
    <div>
      <input
        type="date"
        name="startDate"
        onChange={event => {
          availStartSetter(event.target.value)
          setStartDate(event.target.value)
        }}
        value={startDate}
      />
      <input
        type="date"
        name="endDate"
        onChange={event => {
          availEndSetter(event.target.value)
          setEndDate(event.target.value)
        }}
        value={endDate}
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
