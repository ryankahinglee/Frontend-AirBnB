import React from 'react';
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'

export default function EditButton ({ lId, desc }) {
  const navigate = useNavigate();
  return (
    <div>
      <button onClick={() => {
        navigate(`/editlisting/${lId}`);
      }}>
        {desc}
      </button>
    </div>
  );
}
EditButton.propTypes = {
  lId: PropTypes.number,
  desc: PropTypes.string
}
