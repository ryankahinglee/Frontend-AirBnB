import React from 'react';
import './App.css';
import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom';

// Page imports
import Login from './pages/LoginPage';
import Register from './pages/RegisterPage';
import HostedListing from './pages/HostedListingPage';
import EditListing from './pages/EditListingPage';
import CreateListing from './pages/CreateListingPage';
import AdvancedSearch from './pages/AdvancedSearchPage';
import ListingAvailabilities from './pages/ListingAvailabilitiesPage';
import ListingDetails from './pages/ListingDetailsPage';
import Home from './pages/HomePage';
// useContext for light/dark themes, accessibility
// Global variables
import { contextVariables } from './contextVariables';
// useContext for light/dark themes, accessibility

// Component imports
import Nav from './components/NavBar';
// Note propType validation in eslint has been temporarily disabled. Resolve after propType Lecture
function App () {
  const [token, setToken] = React.useState('');
  const [owner, setOwner] = React.useState('');
  const getters = {
    token,
    owner
  }
  const setters = {
    setToken,
    setOwner
  }
  return (
      <contextVariables.Provider value = {{ getters, setters }}>
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
            <Route path='/listingavailabilities/:lId' element={<ListingAvailabilities />} />
            <Route path='/listingdetails/:lId' element={<ListingDetails />} />
          </Routes>
        </BrowserRouter>
      </contextVariables.Provider>
  )
}

export default App;
