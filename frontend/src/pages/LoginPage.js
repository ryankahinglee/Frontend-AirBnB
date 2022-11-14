import React from 'react';
import { useNavigate } from 'react-router-dom';
import { contextVariables } from '../contextVariables';
import makeRequest from '../makeRequest';
// Importing material ui components
import { Box, Button, TextField, Alert } from '@mui/material';

export default function Login () {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const { setters } = React.useContext(contextVariables);
  const [alert, setAlert] = React.useState(false);
  const navigate = useNavigate();

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '94vh' }}>
      <form
        style= {{
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
          // Send fetch
          const data = { email, password }
          setters.setOwner(email)
          makeRequest('/user/auth/login', 'post', data, '').then((res) => {
            if (res.error === undefined) {
              setters.setToken(res.token);
              navigate('/');
            } else {
              setAlert(true);
            }
          })
          // Change/show popup of successful login
          // Clear input fields
          setEmail('');
          setPassword('');
        }}
      >
        <h3 style={{ color: '#4377cf' }}>
          Enter your login details
        </h3>
        <TextField
          label="Email"
          variant="outlined"
          onChange={event => setEmail(event.target.value)}
          value={email}
          type="text"
          name="email"
        />
        <br/>
        <TextField
          label="Password"
          variant="outlined"
          onChange={event => setPassword(event.target.value)}
          value={password}
          type="text"
          name="password"
        />
        <br/>
        <Button variant='contained' type='submit' value='Submit'>Submit</Button>
        <br/>
        {alert && (
          <Alert severity="error">Invalid Email or Password</Alert>
        )}
      </form>
    </Box>
  );
}
