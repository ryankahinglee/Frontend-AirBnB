import React from 'react';
import './App.css';
// import Button from './components/Button';
import {
  BrowserRouter,
  Routes,
  Route,
  Link
} from 'react-router-dom';

const makeRequest = (route, method, body) => {
  const headers = {
    'Content-Type': 'application/json; charset=UTF-8',
    Accept: 'application/json',
    Authorization: null // Adjust with global token, can place with parameter
  }

  const options = { method, headers }
  if (body !== undefined) {
    options.body = JSON.stringify(body);
  }
  console.log(options.body);
  fetch('http://localhost:5005' + route, options)
    .then((res) => {
      if (res.ok) {
        console.log(res);
        return (res.json());
      } else {
        throw res.status;
      }
    })
    .catch((error) => {
      alert(error.message);
    });
}

const Home = () => {
  return (
    <div>
      <button><Link to='/login'>Login</Link></button>
      <button><Link to='/register'>Register</Link></button>
    </div>
  )
}

const Login = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  return (
    <div>
      <button><Link to='/'>Back to Home</Link></button>
      <form onSubmit={(e) => {
        e.preventDefault();

        // Send fetch
        const body = { email, password }
        makeRequest('/user/auth/login', 'post', body);
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
            value = {email}
          />
        </label>
        <br />
        <label>
          Password
          <input
            type="text"
            name="password"
            onChange={event => setPassword(event.target.value)}
            value = {password}
          />
        </label>
        <br />
        <input type="submit" value="Submit" />
      </form>
    </div>
  )
}

const Register = () => {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirm, setConfirm] = React.useState('');

  return (
    <div>
      <button><Link to='/'>Back to Home</Link></button>
      <form onSubmit={(e) => {
        e.preventDefault();

        if (password !== confirm) {
          alert('Passwords are not the same');
          return;
        }

        // Send fetch
        const body = { name, email, password }
        makeRequest('/user/auth/register', 'post', body);
        console.log(email);

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
            value = {name}
          />
        </label>
        <br />
        <label>
          Email
          <input
            type="text"
            name="email"
            onChange={event => setEmail(event.target.value)}
            value = {email}
          />
        </label>
        <br />
        <label>
          Password
          <input
            type="text"
            name="password"
            onChange={event => setPassword(event.target.value)}
            value = {password}
          />
        </label>
        <br />
        <label>
          Confirm Password
          <input
            type="text"
            name="confirm-password"
            onChange={event => setConfirm(event.target.value)}
            value = {confirm}
          />
        </label>
        <br />
        <input type="submit" value="Submit" />
      </form>
    </div>
  )
}

// Note propType validation in eslint has been temporarily disabled. Resolve after propType Lecture
function App () {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
