import React from 'react';
import PropTypes from 'prop-types'

export default function Booking ({ dateRange, status }) {
  return (
    <div>
      <div> Date range: {dateRange.start} - {dateRange.end} </div>
      <div> Status: {status}</div>
    </div>
  );
}

Booking.propTypes = {
  dateRange: PropTypes.shape({
    start: PropTypes.string,
    end: PropTypes.string
  }),
  status: PropTypes.string
}
