import React from 'react';
import { useNavigate } from 'react-router-dom';
import { tokenContext } from '../token-context';
import makeRequest from '../makeRequest';

export default function Register () {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirm, setConfirm] = React.useState('');

  const { setters } = React.useContext(tokenContext);
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
            onChange={event => setPassword(event.target.value)}
            value={password}
          />
        </label>
        <br />
        <label>
          Confirm Password
          <input
            type="text"
            name="confirm-password"
            onChange={event => setConfirm(event.target.value)}
            value={confirm}
          />
        </label>
        <br />
        <input type="submit" value="Submit" />
      </form>
    </div>
  )
}
