import React from 'react';
import './App.css';
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  // useNavigate
} from 'react-router-dom';
import { tokenContext } from './token-context';
import Login from './pages/Login';
import Register from './pages/Register';
// useContext for light/dark themes, accessibility

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

// Route Home page
const Home = () => {
  // Landing screen, list airbnbs here
  return <></>
}

// Navigationo bar
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
