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
import Bedroom from './components/Bedroom';
import DetailedListingCard from './components/DetailedListingCard';
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

const CreateListing = () => {
  const { getters } = React.useContext(tokenContext);
  const [title, setTitle] = React.useState('');
  const [streetDetails, setStreetDetails] = React.useState('');
  const [city, setCity] = React.useState('');
  const [state, setState] = React.useState('');
  const [postcode, setPostcode] = React.useState('');
  const [country, setCountry] = React.useState('');
  const [price, setPrice] = React.useState(0);
  const [thumbnail, setThumbnail] = React.useState('');
  const [type, setType] = React.useState('');
  const [bathrooms, setBathrooms] = React.useState(0);
  const [bedrooms, setBedrooms] = React.useState([]);
  const [bedCount, setBedCount] = React.useState(0);
  const [bedroomType, setBedroomType] = React.useState('master');
  const [amenities, setAmenities] = React.useState('');
  const options = [
    {
      label: 'Master',
      value: 'master'
    },
    {
      label: 'Children',
      value: 'children'
    },
    {
      label: 'Guest',
      value: 'guest'
    }
  ];
  React.useEffect(() => {
  }, [bedrooms])
  return (<div>
    <form onSubmit={(e) => {
      e.preventDefault();
      // Send fetch
      const body = {
        title,
        address: {
          streetDetails, city, state, postcode, country
        },
        price,
        thumbnail,
        metadata: {
          type,
          bathrooms,
          amenities,
          bedrooms,
          images: []
        }
      };
      makeRequest('/listings/new', 'post', body, getters.token).then((res) => {
      })
      // Clear input fields
      setTitle('');
      setStreetDetails('');
      setCity('');
      setState('');
      setPostcode(0);
      setCountry('');
      setPrice(0);
      setThumbnail('');
      setType('');
      setBathrooms(0);
      setBedrooms([]);
      setAmenities('');
    }}>
      <label>
        Title:&nbsp;
        <input
          type="text"
          name="title"
          onChange={event => setTitle(event.target.value)}
          value = {title}
        />
      </label>
      <br />
      <label>
        Street No. and Name:&nbsp;
        <input
          type="text"
          name="streetNumName"
          onChange={event => setStreetDetails(event.target.value)}
          value = {streetDetails}
        />
      </label>
      <br />
      <label>
        City:&nbsp;
        <input
          type="text"
          name="city"
          onChange={event => setCity(event.target.value)}
          value = {city}
        />
      </label>
      <br />
      <label>
        State:&nbsp;
        <input
          type="text"
          name="state"
          onChange={event => setState(event.target.value)}
          value = {state}
        />
      </label>
      <br />
      <label>
        Postcode:&nbsp;
        <input
          type="number"
          name="postcode"
          onChange={event => setPostcode(event.target.value)}
          value = {postcode}
        />
      </label>
      <br />
      <label>
        Country:&nbsp;
        <input
          type="text"
          name="country"
          onChange={event => setCountry(event.target.value)}
          value = {country}
        />
      </label>
      <br />
      <label>
        Price (per night):&nbsp;
        <input
          type="number"
          name="price"
          onChange={event => setPrice(event.target.value)}
          value = {price}
        />
      </label>
      <br />
      <label>
        Thumbnail of Airbnb:&nbsp;
        <input
          type="text"
          name="thumbnail"
          onChange={event => setThumbnail(event.target.value)}
          value = {thumbnail}
        />
      </label>
      <br />
      <label>
        Type of property:&nbsp;
        <input
          type="text"
          name="type"
          onChange={event => setType(event.target.value)}
          value = {type}
        />
      </label>
      <br />
      <label>
        Number of bathrooms:&nbsp;
        <input
          type="text"
          name="bathrooms"
          onChange={event => setBathrooms(event.target.value)}
          value = {bathrooms}
        />
      </label>
      <br />
      <div>
        <label>
          Available bedrooms:&nbsp;
          <br />
          Type: &nbsp;
          <select onChange = {event => setBedroomType(event.target.value)}>
            {options.map((option, index) => (
              <option key={`bedroom-${index}`} value={option.value}>{option.label}</option>
            ))}
          </select>
          &nbsp;Number of beds:&nbsp;
          <input
            type="number"
            name="bedCount"
            onChange={event => setBedCount(event.target.value)}
            value = {bedCount}
          />
          <br />
          <button onClick = {(event) => {
            event.preventDefault();
            const newBedrooms = bedrooms
            // if bedcount is nothing or 0, dont allow pushing on. get an error up or alert
            if (bedCount !== '' && bedCount > 0) {
              newBedrooms.push({ roomType: bedroomType, numBeds: bedCount })
              setBedrooms(newBedrooms)
              setBedCount(0)
              setBedroomType(bedroomType)
            } else {
              alert('Invalid bed number')
            }
          }}>
            Add Bedroom
          </button>
        </label>
      </div>
      <label>
        Amenities:&nbsp;
        <input
          type="text"
          name="amenities"
          onChange={event => setAmenities(event.target.value)}
          value = {amenities}
        />
      </label>
      <br />
      <input type="submit" value="Submit" />
    </form>
    <div>
      {bedrooms.length > 0 && (
        bedrooms.map((data, index) => (
          <Bedroom key={`bedroom-${index}`} type={data.roomType} count={parseInt(data.numBeds)}/>
        ))
      )}
    </div>
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

const HostedListing = () => {
  const { getters } = React.useContext(tokenContext);
  const [fullListings, setFullListings] = React.useState([]);
  // probably have to check if its actually my listing
  React.useEffect(() => {
    makeRequest('/listings', 'get', undefined, '').then((res) => {
      if (res !== undefined) {
        return Promise.allSettled(res.listings.map((listing) => {
          return makeRequest(`/listings/${listing.id}`, 'get', undefined, getters.token)
        }))
      }
    }).then((res) => {
      setFullListings(res.map(listingPromise => listingPromise.value.listing))
    })
  }, [])
  return (
    <div>
      {fullListings.map((listing, index) => (
        <DetailedListingCard key={`detailedListing-${index}`} title={listing.title} type={listing.metadata.type} bedrooms={listing.metadata.bedrooms} numBathrooms={listing.metadata.bathrooms} reviews={listing.reviews} price={listing.price} thumbnail={listing.thumbnail}/>
      ))}
    </div>
  )
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
        </Routes>
      </BrowserRouter>
    </tokenContext.Provider>
  )
}

export default App;
