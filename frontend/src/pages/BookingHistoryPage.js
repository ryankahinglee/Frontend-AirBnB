import React from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import makeRequest from '../helpers/makeRequest';
import { contextVariables } from '../helpers/contextVariables';
// From material ui
import { Alert, Box, Button } from '@mui/material';
import { styled } from '@mui/system';

// This page displays a listing's booking statistics including time spent online, profit over a year, days booked in this year, and current booking requests and their related information.

export default function BookingHistory () {
  const params = useParams();
  const [searchParams] = useSearchParams();
  const [bookings, setBookings] = React.useState([]);
  const [daysBooked, setDaysBooked] = React.useState(0);
  const [profit, setProfit] = React.useState(0);
  const [alert, setAlert] = React.useState(false);
  const [alertText, setAlertText] = React.useState(false);
  const { getters } = React.useContext(contextVariables);
  const posted = {};
  for (const [key, value] of searchParams.entries()) {
    posted[key] = value;
  }

  let daysOnline = 0;
  let hoursOnline = 0;
  let minutesOnline = 0;
  if (posted.params !== 'null') {
    let timeOnline = new Date() - new Date(posted.params);
    timeOnline = timeOnline / 1000;
    daysOnline = Math.floor(timeOnline / (3600 * 24));
    hoursOnline = Math.floor((timeOnline % (3600 * 24)) / 3600);
    minutesOnline = Math.floor((timeOnline % 3600) / 60);
  }

  React.useEffect(() => {
    makeRequest('/bookings', 'get', undefined, getters.token).then((res) => {
      const data = res.bookings;
      if (data.length !== 0) {
        const currentBookings = data.filter(booking => booking.listingId === params.lId)
        setBookings(currentBookings);
        let dayCount = 0;
        let profitSum = 0;
        currentBookings.forEach((booking) => {
          if ((new Date(booking.dateRange.end)).getFullYear() === (new Date()).getFullYear()) {
            let daysLength = Math.ceil(new Date(booking.dateRange.end) - new Date(booking.dateRange.start));
            daysLength = Math.ceil(daysLength / (1000 * 3600 * 24));
            dayCount += daysLength;
            if (booking.status === 'accepted') {
              profitSum += booking.totalPrice * daysLength;
            }
          }
        });
        setDaysBooked(dayCount);
        setProfit(profitSum);
      }
    })
  }, []);

  const DescriptionBox = styled(Box)({
    display: 'flex',
    textAlign: 'center',
    flexDirection: 'column'
  })

  const Header = styled('h2')({
    color: '#286ee6'
  })

  const DetailLabel = styled('span')({
    color: '#286ee6'
  })

  const BookingBox = styled(Box)({
    borderTop: 'solid',
    borderWidth: '0.1px',
    borderColor: '#6392e3',
    padding: '5px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  })

  const SummaryBox = styled(Box)({
    border: 'solid',
    borderWidth: '0.1vh',
    borderColor: '#6392e3',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '250px',
    padding: '5px 0px'
  })
  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'column', margin: '5px' }}>
      <SummaryBox>
        <DescriptionBox>
          <Header>Time spent Online</Header>
          <p>{daysOnline} days , {hoursOnline} hours and {minutesOnline} minutes</p>
        </DescriptionBox>
        <DescriptionBox>
          <Header>Days currently booked this year</Header>
          <p>{daysBooked} days</p>
        </DescriptionBox>
        <DescriptionBox>
          <Header>Current Profit this year</Header>
          <p name='profit-text'>{profit} dollars</p>
        </DescriptionBox>
        {alert && (
            <Alert name='alert-booking' severity="info">{alertText}</Alert>
        )}
        {bookings.map((booking, index) => (
          <BookingBox
            key={`booking-${index}`}
          >
            <h3 style={{ color: '#286ee6', width: '240px' }}>Booking</h3>
            <p>
              <DetailLabel>Booking Owner: </DetailLabel>{booking.owner}
            </p>
            <p>
              <DetailLabel>Length of booking</DetailLabel>
              <p>{booking.dateRange.start} to {booking.dateRange.end}</p>
            </p>
            <p>
              <DetailLabel>Current Status: </DetailLabel>{booking.status}
            </p>
            {booking.status === 'pending' && (<div>
              <Button
                variant='contained'
                fullWidth
                name='accept-booking-button'
                sx = {{ margin: '5px 0px' }}
                onClick={() => {
                  makeRequest(`/bookings/accept/${booking.id}`, 'put', undefined, getters.token).then((res) => {
                    // Success comment here
                    if (!('error' in res)) {
                      setAlert(true);
                      setAlertText('Booking Accepted');
                      const currentBookings = bookings;
                      currentBookings.forEach((query) => {
                        if (query.id === booking.id) {
                          booking.status = 'accepted';
                          setBookings([...currentBookings]);
                          if ((new Date(booking.dateRange.end)).getFullYear() === (new Date()).getFullYear()) {
                            let daysLength = Math.ceil(new Date(booking.dateRange.end) - new Date(booking.dateRange.start));
                            daysLength = Math.ceil(daysLength / (1000 * 3600 * 24));
                            setProfit(profit + booking.totalPrice * daysLength);
                          }
                        }
                      })
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  })
                }}>
                Accept Booking
              </Button>
              <Button
                variant='contained'
                fullWidth
                onClick={() => {
                  makeRequest(`/bookings/decline/${booking.id}`, 'put', undefined, getters.token).then((res) => {
                    // Success comment here
                    if (!('error' in res)) {
                      setAlert(true);
                      setAlertText('Booking Declined');
                      const currentBookings = bookings;
                      currentBookings.forEach((query) => {
                        if (query.id === booking.id) {
                          booking.status = 'declined';
                          setBookings([...currentBookings]);
                        }
                      })
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  })
                }}
              >
                Decline Booking
              </Button>
            </div>)}
            <br></br>
          </BookingBox>
        ))}
      </SummaryBox>
    </Box>
  );
}
