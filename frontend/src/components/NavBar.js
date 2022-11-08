import React from 'react';
import '../App.css';
import {
  Link,
  useNavigate
} from 'react-router-dom';
import makeRequest from '../makeRequest';

import { contextVariables } from '../contextVariables';

export default function Nav () {
  const { getters, setters } = React.useContext(contextVariables);
  const navigate = useNavigate();
  let navBar = <></>
  if (getters.token === '') {
    navBar = (
      <>
        <button><Link to='/login'>Login</Link></button>
        <button><Link to='/register'>Register</Link></button>
      </>
    )
  } else {
    navBar = (<>
      <button><Link to='/createlisting'>Create Listing</Link></button>
      <button><Link to='/mylistings'>My Listings</Link></button>
      <button onClick = {() => {
        makeRequest('/user/auth/logout', 'post', undefined, getters.token).then(() => {
          setters.setToken('');
          navigate('/');
        })
      }}>
        Logout
      </button>
    </>)
  }
  return (
    <div>
      <button onClick = {() => { navigate('/') }}>
        Home
      </button>
      {navBar}
    </div>
  )
}
