import React from 'react';
import PropTypes from 'prop-types'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TextField, Button, Box } from '@mui/material';
import { styled } from '@mui/system';

export default function Availability ({ start, end, availStartSetter, availEndSetter, availDelete }) {
  const AvailabilityBox = styled(Box)({
    margin: '10px'
  })
  return (
    <AvailabilityBox>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="Start date"
          value={start}
          onChange={(newDate) => {
            const month = (parseInt(newDate.$M) + 1).toString()
            const stringDate = `${newDate.$y}-${month}-${newDate.$D}`
            availStartSetter(stringDate);
          }}
          renderInput={(params) => <TextField {...params} />}
        />
      </LocalizationProvider>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="Start date"
          value={end}
          onChange={(newDate) => {
            const month = (parseInt(newDate.$M) + 1).toString()
            const stringDate = `${newDate.$y}-${month}-${newDate.$D}`
            availEndSetter(stringDate);
          }}
          renderInput={(params) => <TextField {...params} />}
        />
      </LocalizationProvider>
      <Button variant='outlined' onClick={availDelete}>
        Remove Date Range
      </Button>
    </AvailabilityBox>
  );
}
Availability.propTypes = {
  start: PropTypes.string,
  end: PropTypes.string,
  availStartSetter: PropTypes.func,
  availEndSetter: PropTypes.func,
  availDelete: PropTypes.func
}
