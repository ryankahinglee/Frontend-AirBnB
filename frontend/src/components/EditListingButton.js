import React from 'react';
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import { Button } from '@mui/material';

export default function EditListingButton ({ lId, desc }) {
  const navigate = useNavigate();
  return (
    <Button variant='outlined' style={{ width: '100px' }} onClick={() => {
      navigate(`/editlisting/${lId}`);
    }}>
      {desc}
    </Button>
  );
}
EditListingButton.propTypes = {
  lId: PropTypes.number,
  desc: PropTypes.string
}
