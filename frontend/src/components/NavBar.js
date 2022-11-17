import React from 'react';
import '../App.css';
import { useNavigate } from 'react-router-dom';
import makeRequest from '../helpers/makeRequest';
// https://mui.com/material-ui/react-button/ using Material Ui
import Button from '@mui/material/Button';
import { styled } from '@mui/system';

import { contextVariables } from '../helpers/contextVariables';

// This component refers to the navigation bar present on all pages allowing for login ,logout, viewing my listings and making new listings

export default function Nav () {
  const { getters, setters } = React.useContext(contextVariables);
  const navigate = useNavigate();

  const NavButton = styled(Button)({
    width: 'auto',
    padding: '5px 10px',
    margin: '0px 0.2vw'
  });
  const NavigationBar = styled('div')({
    height: '6vh',
    padding: '0.1vh 2vw',
    border: 'solid',
    borderColor: '#bfbfbf',
    borderWidth: '0.1vh',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  });

  let navButtons = <div></div>;
  if (getters.token === '') {
    navButtons = (
      <div>
        <NavButton variant='contained' onClick={() => { navigate('/login') }}>Login</NavButton>
        <NavButton variant='contained' onClick={() => { navigate('/register') }}>Register</NavButton>
      </div>
    );
  } else {
    navButtons = (<div>
      <NavButton variant='contained' onClick={() => { navigate('/createlisting') }}>New Listing</NavButton>
      <NavButton variant='contained' onClick={() => { navigate('/mylistings') }}>My Listings</NavButton>
      <NavButton variant='contained' onClick={() => {
        makeRequest('/user/auth/logout', 'post', undefined, getters.token).then(() => {
          setters.setToken('');
          navigate('/');
        })
      }}>
        Logout
      </NavButton>
    </div>);
  }
  return (
    <NavigationBar>
      <div>
        <NavButton variant='contained' onClick={() => { navigate('/') }}>
          Home
        </NavButton>
      </div>
      <div>
        {navButtons}
      </div>
    </NavigationBar>
  );
}
