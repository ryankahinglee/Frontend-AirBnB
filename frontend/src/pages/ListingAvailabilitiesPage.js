import React from 'react';
import { contextVariables } from '../helpers/contextVariables';
import { useNavigate, useParams } from 'react-router-dom';
import makeRequest from '../helpers/makeRequest';
import Availability from '../components/Availability';
import AvailabilityAdder from '../components/AvailabilityAdder';
import { Alert, Box, Button } from '@mui/material';
import { styled } from '@mui/system';

// This page allows adding availabilities prior to a listing going live

export default function ListingAvailabilities () {
  const { getters } = React.useContext(contextVariables);
  const params = useParams();
  const navigate = useNavigate();
  const [availabilities, setAvailabilities] = React.useState([]);
  const date = new Date();
  const dateString = date.toISOString().split('T')[0];
  const [createAvailStart, setCreateAvailStart] = React.useState(dateString);
  const [createAvailEnd, setCreateAvailEnd] = React.useState(dateString);
  const [alert, setAlert] = React.useState(false);
  React.useEffect(() => {
    makeRequest(`/listings/${params.lId}`, 'get', undefined, getters.token).then((res) => {
      const listing = res.listing;
      setAvailabilities(listing.availability);
    })
  }, [])

  const Page = styled(Box)({
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: '92vh',
    flexDirection: 'column'
  })

  const HeaderTwo = styled('h2')({
    color: '#286ee6'
  })

  const HeaderThree = styled('h3')({
    color: '#286ee6'
  })

  return (
    <Page>
      <HeaderTwo>Create Avaliabilities</HeaderTwo>
      <AvailabilityAdder
        setCreateAvailStart={setCreateAvailStart}
        createAvailStart={createAvailStart}
        setCreateAvailEnd={setCreateAvailEnd}
        createAvailEnd={createAvailEnd}
        availabilities={availabilities}
        setAvailabilities={setAvailabilities}
        setAlert={setAlert}
      />
      {alert && (
          <Alert severity="error">Conflict in dates. Please re-enter date range</Alert>
      )}
      {availabilities.length > 0 && (
        <HeaderThree> Current Availabilities Below </HeaderThree>
      )}
      {availabilities.length > 0 && (
        availabilities.map((data, index) => (
          <Availability
            key={`availability-${index}`}
            start={data.start}
            end={data.end}
            availStartSetter={(newStart) => {
              const newAvailabilities = [...availabilities];
              newAvailabilities[index].start = newStart;
              setAvailabilities(newAvailabilities);
            }}
            availEndSetter={(newEnd) => {
              const newAvailabilities = [...availabilities];
              newAvailabilities[index].end = newEnd;
              setAvailabilities(newAvailabilities);
            }}
            availDelete={() => {
              const newAvailabilities = [...availabilities];
              newAvailabilities.splice(index, 1);
              setAvailabilities([...newAvailabilities]);
            }}
          />
        ))
      )}
      <Button variant='contained' sx = {{ margin: '10px' }} onClick={() => {
        makeRequest(`/listings/publish/${params.lId}`, 'put', { availability: availabilities }, getters.token).then((res) => {
          if (!('error' in res)) {
            navigate('/mylistings');
          }
        })
      }}>
        {'Go Live!'}
      </Button>
    </Page>
  );
}
