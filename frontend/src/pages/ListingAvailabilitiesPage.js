import React from 'react';
import { contextVariables } from '../contextVariables';
import { useNavigate, useParams } from 'react-router-dom';
import makeRequest from '../makeRequest';
import Availability from '../components/Availability';
export default function ListingAvailabilities () {
  const { getters } = React.useContext(contextVariables);
  const params = useParams();
  const navigate = useNavigate();
  const [availabilities, setAvailabilities] = React.useState([]);
  const date = new Date();
  const dateString = date.toISOString().split('T')[0]
  const [createAvailStart, setCreateAvailStart] = React.useState(dateString);
  const [createAvailEnd, setCreateAvailEnd] = React.useState(dateString);
  React.useEffect(() => {
    makeRequest(`/listings/${params.lId}`, 'get', undefined, getters.token).then((res) => {
      const listing = res.listing
      setAvailabilities(listing.availability)
    })
  }, [])
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
        const newAvailabilities = availabilities
        // check for conflicts
        if (!dateConflict(createAvailStart, createAvailEnd, newAvailabilities)) {
          newAvailabilities.push({
            start: createAvailStart,
            end: createAvailEnd
          })
          setAvailabilities([...newAvailabilities])
        } else {
          alert('Conflict in dates. Please re-enter date range')
        }
      }}>
        {'Add Availability Range'}
      </button>
      {availabilities.length > 0 && (
        <div> Current Availabilities Below </div>
      )}
      {availabilities.length > 0 && (
        availabilities.map((data, index) => (
          <Availability
            key={`availability-${index}`}
            start={data.start}
            end={data.end}
            availStartSetter={(newStart) => {
              const newAvailabilities = [...availabilities]
              newAvailabilities[index].start = newStart
              setAvailabilities(newAvailabilities)
            }}
            availEndSetter={(newEnd) => {
              const newAvailabilities = [...availabilities]
              newAvailabilities[index].end = newEnd
              setAvailabilities(newAvailabilities)
            }}
            availDelete={() => {
              const newAvailabilities = [...availabilities]
              newAvailabilities.splice(index, 1)
              setAvailabilities([...newAvailabilities])
            }}
          />
        ))
      )}
      <button onClick={() => {
        // merging of availabilitis then make request
        makeRequest(`/listings/publish/${params.lId}`, 'put', { availability: availabilities }, getters.token).then((res) => {
          if (!('error' in res)) {
            navigate('/mylistings');
          }
        })
      }}>
        {'Go Live!'}
      </button>
    </div>
  )
}

function dateConflict (start, end, newAvailabilities) {
  for (const dateRange of newAvailabilities) {
    if ((new Date(start).getTime() <= new Date(dateRange.end).getTime()) && (new Date(end).getTime() >= new Date(dateRange.start).getTime())) {
      return true
    }
  }
  return false
}
