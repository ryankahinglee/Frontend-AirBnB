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
import Login from './pages/Login';
import Register from './pages/Register';
import HostedListing from './pages/HostedListing';
import EditListing from './pages/EditListing';
import CreateListing from './pages/CreateListing';
import ListingAvailabilities from './pages/ListingAvailabilities';
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

const Nav = () => {
  const { getters, setters } = React.useContext(tokenContext);
  const navigate = useNavigate();
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
        <button><Link to='/mylistings'>My Listings</Link></button>
        <button onClick = {() => {
          makeRequest('/user/auth/logout', 'post', undefined, getters.token).then(() => {
            setters.setToken('');
            navigate('/');
          })
        }}>
          Logout
        </button>
        <button><Link to='/createlisting'>Create Listing</Link></button>
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
          <Route path='/createlisting' element={<CreateListing />} />
          <Route path='/mylistings' element={<HostedListing />} />
          <Route path='/editlisting/:lId' element={<EditListing/>} />
          <Route path='/listingavailabilities/:lId' element={<ListingAvailabilities/>} />
        </Routes>
      </BrowserRouter>
    </tokenContext.Provider>
  )
}

export default App;
