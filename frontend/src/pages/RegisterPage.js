import React from 'react';
import { useNavigate } from 'react-router-dom';
import { contextVariables } from '../contextVariables';
import makeRequest from '../makeRequest';
// From material ui
import Alert from '@mui/material/Alert';

export default function Register () {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirm, setConfirm] = React.useState('');
  const [samePassword, setSamePassword] = React.useState(true);
  const { setters } = React.useContext(contextVariables);
  const navigate = useNavigate();

  return (
    <div>
      <form onSubmit={(e) => {
        e.preventDefault();

        if (password !== confirm) {
          alert('Passwords are not the same');
          return;
        }

        // Send fetch
        const data = { name, email, password }
        setters.setOwner(email)
        makeRequest('/user/auth/register', 'post', data, '').then((res) => {
          if (res !== undefined) {
            setters.setToken(res.token);
            navigate('/');
          }
        })

        // Clear input fields
        setName('');
        setEmail('');
        setPassword('');
        setConfirm('');
      }}>
        <label>
          Name
          <input
            type="text"
            name="name"
            onChange={event => setName(event.target.value)}
            value={name}
          />
        </label>
        <br />
        <label>
          Email
          <input
            type="text"
            name="email"
            onChange={event => setEmail(event.target.value)}
            value={email}
          />
        </label>
        <br />
        <label>
          Password
          <input
            type="text"
            name="password"
            onChange={event => {
              if (event.target.value !== confirm) {
                setSamePassword(false);
              } else {
                setSamePassword(true);
              }
              setPassword(event.target.value)
            }}
            value = {password}
          />
        </label>
        <br />
        <label>
          Confirm Password
          <input
            type="text"
            name="confirm-password"
            onChange={event => {
              if (event.target.value !== password) {
                setSamePassword(false);
              } else {
                setSamePassword(true);
              }
              setConfirm(event.target.value)
            }}
            value = {confirm}
          />
        </label>
        <br />
        <input type="submit" value="Submit" />
      </form>
      {!samePassword && (
        <Alert severity="warning">Passwords are not the same!</Alert>
      )}
    </div>
  )
}
