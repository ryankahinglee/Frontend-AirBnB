import React from 'react';
import { useNavigate } from 'react-router-dom';
import { contextVariables } from '../contextVariables';
import makeRequest from '../makeRequest';
// From material ui
import { Box, TextField, Alert, Button } from '@mui/material';

export default function Register () {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [samePassword, setSamePassword] = React.useState(true);
  const [alert, setAlert] = React.useState(false);
  const { setters } = React.useContext(contextVariables);
  const navigate = useNavigate();

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '94vh' }}>
      <form
        style={{
          border: 'solid',
          borderColor: '#bfbfbf',
          borderWidth: '0.1vh',
          borderRadius: '5px',
          padding: '10px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '250px'
        }}
        onSubmit={(e) => {
          e.preventDefault();

          if (password !== confirmPassword) {
            setSamePassword(false);
            return;
          }

          // Send fetch
          const data = { name, email, password };
          setters.setOwner(email);
          makeRequest('/user/auth/register', 'post', data, '').then((res) => {
            if (res.error === undefined) {
              setters.setToken(res.token);
              navigate('/');
            } else {
              setAlert(true);
            }
          })

          // Clear input fields
          setName('');
          setEmail('');
          setPassword('');
          setConfirmPassword('');
        }}>
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
          label="Email"
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
        <Button variant='contained' type='submit' value='Submit'>Submit</Button>
        <br />
        {!samePassword && (
          <Alert severity="warning">Passwords are not the same!</Alert>
        )}
        {alert && (
          <Alert severity="error">Invalid Input, Email has already been taken</Alert>
        )}
      </form>
    </Box>
  )
}
