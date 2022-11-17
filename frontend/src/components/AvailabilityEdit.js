import React from 'react';
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
// From material ui
import { Button } from '@mui/material';

// This component refers to a button which navigates to a page which allows availabilities editing for a listing prior to going live.
export default function AvailabilityEdit ({ lId, desc }) {
  const navigate = useNavigate();
  return (
    <Button variant='outlined' name='publish-button' onClick={() => {
      navigate(`/listingavailabilities/${lId}`);
    }}>
      {desc}
    </Button>
  );
}
AvailabilityEdit.propTypes = {
  lId: PropTypes.number,
  desc: PropTypes.string
}
