import React from 'react';

// variables which require access on multiple pages so React's context hook helps to handle this issue

export const initialValue = {
  token: '',
  owner: ''
}

export const contextVariables = React.createContext(initialValue);
