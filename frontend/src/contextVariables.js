import React from 'react';

export const initialValue = {
  token: '',
  owner: ''
}

export const contextVariables = React.createContext(initialValue);
