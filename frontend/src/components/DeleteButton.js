import React from 'react';
import PropTypes from 'prop-types'
import makeRequest from '../makeRequest';
import { tokenContext } from '../token-context';
export default function DeleteButton ({ lId, desc, listingSetter }) {
  const { getters } = React.useContext(tokenContext);
  return (
    <div>
      <button onClick={() => {
        makeRequest(`/listings/${lId}`, 'delete', undefined, getters.token).then((res) => {
          if (!('error' in res)) {
            listingSetter(lId)
          }
        })
      }}>
        {desc}
      </button>
    </div>
  );
}
DeleteButton.propTypes = {
  lId: PropTypes.number,
  desc: PropTypes.string,
  listingSetter: PropTypes.func
}
