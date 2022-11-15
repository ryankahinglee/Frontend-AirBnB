import React from 'react';
import PropTypes from 'prop-types'
import { MenuItem, Select, TextField, Button } from '@mui/material';

export default function Bedroom ({ bedroomType, bedCount, onBedroomTypeChange, onBedCountChange, bedroomDelete }) {
  return (
    <div
      style={{
        border: 'solid',
        borderColor: '#bfbfbf',
        borderWidth: '0.1vh',
        borderRadius: '5px',
        padding: '10px',
        margin: '10px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '300px'
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          width: '300px'
        }}
      >
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
      </div>
      <Button
        style={{ margin: '10px' }}
        variant="contained"
        onClick={bedroomDelete}
      >
        Delete Bedroom
      </Button>
    </div>
  );
}

Bedroom.propTypes = {
  bedroomType: PropTypes.string,
  bedCount: PropTypes.string,
  onBedCountChange: PropTypes.func,
  onBedroomTypeChange: PropTypes.func,
  bedroomDelete: PropTypes.func
}
