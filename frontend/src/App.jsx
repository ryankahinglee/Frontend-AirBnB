import React from 'react';
import './App.css';
import ListingCard from './components/ListingCard';
// import Button from './components/Button';
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate
} from 'react-router-dom';
import { tokenContext } from './token-context';
// useContext for light/dark themes, accessibility
// Global variables
// const [token, setToken] = React.useState('');

const makeRequest = async (route, method, body, token) => {
  const headers = {
    'Content-Type': 'application/json; charset=UTF-8',
    Accept: 'application/json',
    Authorization: token // Adjust with global token, can place with parameter
  }

  const options = { method, headers }
  if (body !== undefined) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch('http://localhost:5005' + route, options);
    if (!response.ok) {
      throw Error(response.status);
    }
    const json = await response.json();
    return json;
  } catch (error) {
    if (error.message === '400') {
      alert('Error Status 400: Invalid Input');
    } else if (error.message === '403') {
      alert('Error Status 403: Invalid Token');
    } else {
      alert(error);
    }
  }
}

// Route pages
const Home = () => {
  // Landing screen, list airbnbs here
  // meant to be token here also in make request
  const [listings, setListings] = React.useState([]);

  React.useEffect(() => {
    makeRequest('/listings', 'get', undefined, '').then((res) => {
      if (res !== undefined) {
        setListings(res.listings)
      }
    })
  }, [])
  // bookings of accepted and stuff and then alphabetic sorting
  return (
    <div>
      {listings.map((data, index) => (
        <ListingCard key={`listing-${index}`} title={data.title} thumbnail={data.thumbnail} reviews={data.reviews}/>
      ))}
    </div>
  )
}

const Login = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const { setters } = React.useContext(tokenContext);
  const navigate = useNavigate();
  return (
    <div>
      <form onSubmit={ (e) => {
        e.preventDefault();

        // Send fetch
        const body = { email, password }
        makeRequest('/user/auth/login', 'post', body, '').then((res) => {
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
        const body = { name, email, password }
        makeRequest('/user/auth/register', 'post', body, '').then((res) => {
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

const Nav = () => {
  const { getters, setters } = React.useContext(tokenContext);
  if (getters.token === '') {
    return (
      <div>
        <button><Link to='/login'>Login</Link></button>
        <button><Link to='/register'>Register</Link></button>
      </div>
    )
  } else {
    return (
      <div>
        <button onClick = {() => {
          makeRequest('/user/auth/logout', 'post', undefined, getters.token).then(() => {
            setters.setToken('');
          })
        }}>
          Logout
        </button>
      </div>
    )
  }
}

// Note propType validation in eslint has been temporarily disabled. Resolve after propType Lecture
function App () {
  const [token, setToken] = React.useState('');
  const getters = {
    token
  }
  const setters = {
    setToken
  }

  return (
    <tokenContext.Provider value = {{ getters, setters }}>
      <BrowserRouter>
        <Nav />
        <br />
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
        </Routes>
      </BrowserRouter>
    </tokenContext.Provider>
  )
}

export default App;
