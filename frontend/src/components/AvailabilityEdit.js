import React from 'react';
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
export default function AvailabilityEdit ({ lId, desc }) {
  const navigate = useNavigate();
  return (
    <div>
      <button onClick={() => {
        navigate(`/listingavailabilities/${lId}`);
      }}>
        {desc}
      </button>
    </div>
  );
}
AvailabilityEdit.propTypes = {
  lId: PropTypes.number,
  desc: PropTypes.string
}
