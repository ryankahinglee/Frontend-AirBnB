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
import Login from './pages/Login';
import Register from './pages/Register';
import HostedListing from './pages/HostedListing';
import EditListing from './pages/EditListing';
import CreateListing from './pages/CreateListing';
import AdvancedSearch from './pages/AdvancedSearch';
import ListingAvailabilities from './pages/ListingAvailabilities';

// Global variables
import { tokenContext } from './token-context';
import { ownerContext } from './ownerContext';
// useContext for light/dark themes, accessibility

const Home = () => {
  // Landing screen, list airbnbs here
  const [listings, setListings] = React.useState([]);
  const [bookings, setBookings] = React.useState([]);
  const { getters } = React.useContext(tokenContext);

  React.useEffect(() => {
    makeRequest('/listings', 'get', undefined, '').then((res) => {
      console.log(res);
      if (res !== undefined) {
        return Promise.allSettled(res.listings.map((listing) => {
          return makeRequest(`/listings/${listing.id}`, 'get', undefined, getters.token).then((res) => {
            return {
              published: res.listing.published,
              ...res.listing
            }
          })
        }))
      }
    }).then((res) => {
      const newListings = [];
      res.forEach((listing) => {
        if (listing.value.published === true) {
          newListings.push(listing.value);
        }
      })
      setListings(newListings)
    }).then(() => {
      if (getters.token !== '') {
        makeRequest('/bookings', 'get', undefined, getters.token).then((res) => {
          if (res !== undefined) {
            setBookings(res.bookings)
          }
        })
      }
    })
  }, [])
  // bookings of accepted and stuff and then alphabetic sorting
  const currentListings = listings;
  if (currentListings.length > 1) {
    currentListings.sort(function (a, b) {
      const stringTwo = b.title.toLowerCase();
      const stringOne = a.title.toLowerCase();
      return stringOne.localeCompare(stringTwo);
    })
  }
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
        <ListingCard key={`listing-${index}`} id={data.id} title={data.title} thumbnail={data.thumbnail} reviews={data.reviews} bookings={bookings}/>
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
            <Route path='/editlisting/:lId' element={<EditListing/>} />
            <Route path='/advancedSearch' element={<AdvancedSearch/>}/>
            {/* <Route path='/deletelisting/:lId' element={<DeleteListing/>} /> */}
            <Route path='/listingavailabilities/:lId' element={<ListingAvailabilities/>} />
          </Routes>
        </BrowserRouter>
      </tokenContext.Provider>
    </ownerContext.Provider>
  )
}

export default App;
