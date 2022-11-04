import React from 'react';
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'

export default function EditButton ({ route, desc }) {
  const navigate = useNavigate();
  return (
    <div>
      <button onClick={() => {
        navigate(route);
      }}>
        {desc}
      </button>
    </div>
  );
}
EditButton.propTypes = {
  route: PropTypes.string,
  desc: PropTypes.string
}
