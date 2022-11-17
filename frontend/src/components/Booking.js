import React from 'react';
import PropTypes from 'prop-types'
// From material ui
import { Box } from '@mui/material';
import { styled } from '@mui/system';

// This component shows a booking's time period as well as the status of a booking
export default function Booking ({ dateRange, status }) {
  const BookingBox = styled(Box)({
    border: 'solid',
    borderRadius: '10px',
    borderColor: '#6392e3 ',
    borderWidth: '0.1px',
    padding: '5px',
    margin: '5px',
    textAlign: 'center',
    width: '200px'
  })
  return (
    <BookingBox>
      <h3 style={{ color: '#286ee6' }}>Date range</h3>
      <p>{dateRange.start} - {dateRange.end}</p>
      <p>Current status is {status}</p>
    </BookingBox>
  );
}

Booking.propTypes = {
  dateRange: PropTypes.shape({
    start: PropTypes.string,
    end: PropTypes.string
  }),
  status: PropTypes.string
}
