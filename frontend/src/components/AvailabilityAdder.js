import React from 'react';
import PropTypes from 'prop-types'

export default function AvailabilityAdder ({ setCreateAvailStart, createAvailStart, setCreateAvailEnd, createAvailEnd, availabilities, setAvailabilities, setAlert }) {
  return (
    <div>
      <input
      type="date"
      name="startDate"
      onChange={event => setCreateAvailStart(event.target.value)}
      value={createAvailStart}
      />
      <input
        type="date"
        name="endDate"
        onChange={event => setCreateAvailEnd(event.target.value)}
        value={createAvailEnd}
      />
      <button onClick={() => {
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
      </button>
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
