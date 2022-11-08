import React from 'react';
import './App.css';
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
  createSearchParams
} from 'react-router-dom';
import makeRequest from './makeRequest';

// Component imports
import ListingCard from './components/ListingCard';
import SearchFilter from './components/SearchFilter';

// Page impmorts
import { tokenContext } from './token-context';
import { ownerContext } from './ownerContext';
import Login from './pages/Login';
import Register from './pages/Register';
import HostedListing from './pages/HostedListing';
import EditListing from './pages/EditListing';
import CreateListing from './pages/CreateListing';
import AdvancedSearch from './pages/AdvancedSearch';
import ListingAvailabilities from './pages/ListingAvailabilities';
import ListingDetails from './pages/ListingDetails';
// useContext for light/dark themes, accessibility
// Global variables
// const [token, setToken] = React.useState('');

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

  const currentListings = listings
  currentListings.sort(function (a, b) {
    const stringTwo = b.title.toLowerCase();
    const stringOne = a.title.toLowerCase();
    return stringOne.localeCompare(stringTwo);
  })

  const [title, setTitle] = React.useState('');
  const navigate = useNavigate();

  return (
    <div>
      <div>
        <form>
          <input type='text'
            placeholder='Search by Title'
            onChange = {event => setTitle(event.target.value)}
            onKeyPress = {event => {
              if (event.key === 'Enter') {
                event.preventDefault();
                const sortByHighest = true;
                const params = { title, sortByHighest }
                navigate({
                  pathname: '/advancedSearch',
                  search: `?${createSearchParams(params)}`,
                });
              }
            }}
          ></input>
        </form>
      </div>
      <SearchFilter />
      <h1> Available Listings </h1>
      <hr></hr>
      {currentListings.map((data, index) => (
        <ListingCard key={`listing-${index}`} title={data.title} thumbnail={data.thumbnail} reviews={data.reviews} lId={parseInt(data.id)}/>
      ))}
    </div>
  )
}

const Nav = () => {
  const { getters, setters } = React.useContext(tokenContext);
  const navigate = useNavigate();
  let navBar = <></>
  if (getters.token === '') {
    navBar = (
      <>
        <button><Link to='/login'>Login</Link></button>
        <button><Link to='/register'>Register</Link></button>
      </>
    )
  } else {
    navBar = (<>
      <button><Link to='/createlisting'>Create Listing</Link></button>
      <button><Link to='/mylistings'>My Listings</Link></button>
      <button onClick = {() => {
        makeRequest('/user/auth/logout', 'post', undefined, getters.token).then(() => {
          setters.setToken('');
          navigate('/');
        })
      }}>
        Logout
      </button>
    </>)
  }
  return (
    <div>
      <button onClick = {() => { navigate('/') }}>
        Home
      </button>
      {navBar}
    </div>
  )
}

// Note propType validation in eslint has been temporarily disabled. Resolve after propType Lecture
function App () {
  const [token, setToken] = React.useState('');
  const [owner, setOwner] = React.useState('');
  const getters = {
    token
  }
  const setters = {
    setToken
  }
  const ownerGetter = {
    owner
  }
  const ownerSetter = {
    setOwner
  }
  return (
    <ownerContext.Provider value= {{ ownerGetter, ownerSetter }}>
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
            <Route path='/editlisting/:lId' element={<EditListing />} />
            <Route path='/advancedSearch' element={<AdvancedSearch />}/>
            {/* <Route path='/deletelisting/:lId' element={<DeleteListing/>} /> */}
            <Route path='/listingavailabilities/:lId' element={<ListingAvailabilities />} />
            <Route path='/listingdetails/:lId' element={<ListingDetails />} />
          </Routes>
        </BrowserRouter>
      </tokenContext.Provider>
    </ownerContext.Provider>
  )
}

export default App;
