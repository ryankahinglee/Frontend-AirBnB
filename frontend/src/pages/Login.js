import React from 'react';
import { useNavigate } from 'react-router-dom';
import { tokenContext } from '../token-context';
import { ownerContext } from '../ownerContext';
import makeRequest from '../makeRequest';

export default function Login () {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const { setters } = React.useContext(tokenContext);
  const { ownerSetter } = React.useContext(ownerContext);
  const navigate = useNavigate();

  return (
    <div>
      <form onSubmit={(e) => {
        e.preventDefault();
        // Send fetch
        const data = { email, password }
        ownerSetter.setOwner(email)
        makeRequest('/user/auth/login', 'post', data, '').then((res) => {
          if (res !== undefined) {
            setters.setToken(res.token);
            navigate('/');
          }
        })
        // Change/show popup of successful login
        // Clear input fields
        setEmail('');
        setPassword('');
      }}>
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
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
}
