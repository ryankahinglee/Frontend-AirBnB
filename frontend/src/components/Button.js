import React from 'react';

const Button = (props) => {
  return <button
    style={{
      width: '3vw'
    }}
    onClick={props.click}
    >
      {props.text}
    </button>
}

export default Button;
