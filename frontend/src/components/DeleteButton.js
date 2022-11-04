import React from 'react';
import PropTypes from 'prop-types'
// import { useNavigate } from 'react-router-dom'

export default function DeleteButton ({ route, desc }) {
  // const navigate = useNavigate();
  return (
    <div>
      <button onClick={() => {
        // make request here
        // navigate(route);
      }}>
        {desc}
      </button>
    </div>
  );
}
DeleteButton.propTypes = {
  route: PropTypes.string,
  desc: PropTypes.string
}
