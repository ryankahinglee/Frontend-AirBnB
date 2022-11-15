import React from 'react';
import PropTypes from 'prop-types'
import { Box } from '@mui/material';

export default function Booking ({ dateRange, status }) {
  return (
    <Box sx={{
      border: 'solid',
      borderRadius: '10px',
      borderColor: '#6392e3 ',
      borderWidth: '0.1px',
      padding: '5px',
      margin: '5px',
      textAlign: 'center',
      width: '200px'
    }}>
      <h3 style={{ color: '#286ee6' }}>Date range</h3>
      <p>{dateRange.start} - {dateRange.end}</p>
      <p>Current status is {status}</p>
    </Box>
  );
}

Booking.propTypes = {
  dateRange: PropTypes.shape({
    start: PropTypes.string,
    end: PropTypes.string
  }),
  status: PropTypes.string
}
