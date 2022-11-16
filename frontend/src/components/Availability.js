import React from 'react';
import PropTypes from 'prop-types'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TextField, Button, Box } from '@mui/material';

export default function Availability ({ start, end, availStartSetter, availEndSetter, availDelete }) {
  return (
    <Box sx={{ margin: '10px' }}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="Start date"
          value={start}
          onChange={(newDate) => {
            const month = (parseInt(newDate.$M) + 1).toString()
            const stringDate = `${newDate.$Y}-${month}-${newDate.$D}`
            availStartSetter(stringDate);
          }}
          renderInput={(params) => <TextField {...params} />}
        />
      </LocalizationProvider>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="End date"
          value={end}
          onChange={(newDate) => {
            const month = (parseInt(newDate.$M) + 1).toString()
            const stringDate = `${newDate.$Y}-${month}-${newDate.$D}`
            availEndSetter(stringDate);
          }}
          renderInput={(params) => <TextField {...params} />}
        />
      </LocalizationProvider>
      <Button variant='outlined' onClick={availDelete}>
        Remove Date Range
      </Button>
    </Box>
  );
}
Availability.propTypes = {
  start: PropTypes.string,
  end: PropTypes.string,
  availStartSetter: PropTypes.func,
  availEndSetter: PropTypes.func,
  availDelete: PropTypes.func
}
