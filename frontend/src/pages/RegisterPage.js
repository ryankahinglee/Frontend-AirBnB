import React from 'react';
import { useNavigate } from 'react-router-dom';
import { contextVariables } from '../helpers/contextVariables';
import makeRequest from '../helpers/makeRequest';
// From material ui
import { Box, TextField, Alert, Button } from '@mui/material';
import { FormBox } from '../components/FormBox';

// This page allows registraton functionality for the website

export default function Register () {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [samePassword, setSamePassword] = React.useState(true);
  const [alertEmail, setAlertEmail] = React.useState(false);
  const [alertPassword, setAlertPassword] = React.useState(false);
  const { setters } = React.useContext(contextVariables);
  const navigate = useNavigate();

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '92vh' }}>
      <FormBox>
        <h3 style={{ color: '#4377cf' }}>
          Register an account
        </h3>
        <TextField
          label="Name"
          variant="outlined"
          onChange={event => setName(event.target.value)}
          value={name}
          type="text"
          name="name"
        />
        <br />
        <TextField
          label="Email"
          variant="outlined"
          onChange={event => setEmail(event.target.value)}
          value={email}
          type="text"
          name="email"
        />
        <br />
        <TextField
          label="Password"
          variant="outlined"
          onChange={event => {
            if (event.target.value !== confirm) {
              setSamePassword(false);
            } else {
              setSamePassword(true);
            }
            setPassword(event.target.value);
          }}
          value={password}
          type="text"
          name="password"
        />
        <br />
        <TextField
          label="Confirm Password"
          variant="outlined"
          onChange={event => {
            if (event.target.value !== password) {
              setSamePassword(false);
            } else {
              setSamePassword(true);
            }
            setConfirmPassword(event.target.value);
          }}
          value={confirmPassword}
          type="text"
          name="confirmPassword"
        />
        <br />
        <Button variant='contained' type='submit' value='Submit' name='submit-button'
          onClick={(e) => {
            e.preventDefault();
            if (password === '') {
              setAlertPassword(true);
              setAlertEmail(false);
              return;
            } else if (password !== confirmPassword) {
              setSamePassword(false);
              return;
            }
            const data = { name, email, password };
            setters.setOwner(email);
            makeRequest('/user/auth/register', 'post', data, '').then((res) => {
              if (res.error === undefined) {
                setters.setToken(res.token);
                navigate('/');
              } else {
                setAlertEmail(true);
                setAlertPassword(false);
              }
            })
            setName('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');
          }}>
            Submit
          </Button>
        <br />
        {!samePassword && (
          <Alert name='alert-same-password' severity="warning">Passwords are not the same!</Alert>
        )}
        {alertEmail && (
          <Alert severity="error">Invalid Input, Email has already been taken</Alert>
        )}
        {alertPassword && (
          <Alert severity="error">Invalid Input, Password cannot be an empty string</Alert>
        )}
      </FormBox>
    </Box>
  )
}
