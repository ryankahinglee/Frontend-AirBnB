import React from 'react';
import PropTypes from 'prop-types'
import makeRequest from '../makeRequest';
import { contextVariables } from '../contextVariables';
import { Button } from '@mui/material';

export default function DeleteButton ({ lId, desc, listingSetter }) {
  const { getters } = React.useContext(contextVariables);
  return (
    <div>
      <Button variant='outlined' onClick={() => {
        makeRequest(`/listings/${lId}`, 'delete', undefined, getters.token).then((res) => {
          if (!('error' in res)) {
            listingSetter(lId)
          }
        })
      }}>
        {desc}
      </Button>
    </div>
  );
}
DeleteButton.propTypes = {
  lId: PropTypes.number,
  desc: PropTypes.string,
  listingSetter: PropTypes.func
}
