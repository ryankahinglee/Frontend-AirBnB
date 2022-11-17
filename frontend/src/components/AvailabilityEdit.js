import React from 'react';
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import { Button } from '@mui/material';

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
