import React from 'react';
import PropTypes from 'prop-types'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TextField, Button, Alert } from '@mui/material';

export default function AvailabilityAdder ({ setCreateAvailStart, createAvailStart, setCreateAvailEnd, createAvailEnd, availabilities, setAvailabilities, setAlert }) {
  const [invalidDates, setInvalidDates] = React.useState(false);
  return (
    <div>
      <LocalizationProvider dateAdapter={AdapterDayjs} name='date-start-add'>
        <DatePicker
          label="Start date"
          value={createAvailStart}
          name='date-start-add'
          onChange={(newDate) => {
            const month = (parseInt(newDate.$M) + 1).toString()
            const stringDate = `${newDate.$y}-${month}-${newDate.$D}`
            setCreateAvailStart(stringDate);
          }}
          renderInput={(params) => <TextField {...params} />}
        />
      </LocalizationProvider>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="End date"
          name='date-end-add'
          value={createAvailEnd}
          onChange={(newDate) => {
            const month = (parseInt(newDate.$M) + 1).toString()
            const stringDate = `${newDate.$y}-${month}-${newDate.$D}`
            setCreateAvailEnd(stringDate);
          }}
          renderInput={(params) => <TextField {...params} />}
        />
      </LocalizationProvider>
      <Button variant='outlined' name='availability-range-button' onClick={() => {
        if (new Date(createAvailEnd) - new Date(createAvailStart) <= 0) {
          setInvalidDates(true);
          return;
        } else {
          setInvalidDates(false);
        }
        const newAvailabilities = availabilities;
        // check for conflicts
        if (!dateConflict(createAvailStart, createAvailEnd, newAvailabilities)) {
          newAvailabilities.push({
            start: createAvailStart,
            end: createAvailEnd
          });
          setAvailabilities([...newAvailabilities]);
          setAlert(false);
        } else {
          setAlert(true);
        }
      }}>
        {'Add Availability Range'}
      </Button>
      {invalidDates && (
        <Alert severity='error'>Invalid dates, the end date must be after the start date</Alert>
      )}
    </div>
  );
}

AvailabilityAdder.propTypes = {
  setCreateAvailStart: PropTypes.func,
  createAvailStart: PropTypes.string,
  setCreateAvailEnd: PropTypes.func,
  createAvailEnd: PropTypes.string,
  availabilities: PropTypes.array,
  setAvailabilities: PropTypes.func,
  setAlert: PropTypes.func
}

function dateConflict (start, end, newAvailabilities) {
  for (const dateRange of newAvailabilities) {
    if ((new Date(start).getTime() <= new Date(dateRange.end).getTime()) && (new Date(end).getTime() >= new Date(dateRange.start).getTime())) {
      return true;
    }
  }
  return false;
}
