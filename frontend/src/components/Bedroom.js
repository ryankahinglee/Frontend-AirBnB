import React from 'react';
import PropTypes from 'prop-types'
// From material ui
import { MenuItem, Select, TextField, Button, Box } from '@mui/material';
import { BedroomBox } from '../components/BedroomBox'

// This component refers to a bedroom component which shows type as well as the number of beds in it as well as the ability to delete them. These components belong in the edit/create listing pages.
export default function Bedroom ({ bedroomType, bedCount, onBedroomTypeChange, onBedCountChange, bedroomDelete }) {
  return (
    <BedroomBox>
      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '300px' }}>
        <Select
          value={bedroomType}
          onChange={event => onBedroomTypeChange(event.target.value)}
        >
          <MenuItem value={'master'}>Master</MenuItem>
          <MenuItem value={'children'}>Children</MenuItem>
          <MenuItem value={'guest'}>Guest</MenuItem>
        </Select>
        <br />
        <TextField
          label="Number of beds"
          variant="outlined"
          name="bedCount"
          onChange={event => onBedCountChange(event.target.value)}
          value={bedCount}
          type="number"
        />
      </Box>
      <Button
        style={{ margin: '10px' }}
        variant="contained"
        onClick={bedroomDelete}
      >
        Delete Bedroom
      </Button>
    </BedroomBox>
  );
}

Bedroom.propTypes = {
  bedroomType: PropTypes.string,
  bedCount: PropTypes.string,
  onBedCountChange: PropTypes.func,
  onBedroomTypeChange: PropTypes.func,
  bedroomDelete: PropTypes.func
}
