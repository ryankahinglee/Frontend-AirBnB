import React from 'react';
import { useNavigate } from 'react-router-dom';
import { contextVariables } from '../contextVariables';
import makeRequest from '../makeRequest';
import Bedroom from '../components/Bedroom';
import { fileToDataUrl } from '../imageToURLHelper';

export default function CreateListing () {
  const navigate = useNavigate();
  const { getters } = React.useContext(contextVariables);
  const [title, setTitle] = React.useState('');
  const [streetDetails, setStreetDetails] = React.useState('');
  const [city, setCity] = React.useState('');
  const [state, setState] = React.useState('');
  const [postcode, setPostcode] = React.useState(0);
  const [country, setCountry] = React.useState('');
  const [price, setPrice] = React.useState(0);
  const [thumbnail, setThumbnail] = React.useState('');
  const [type, setType] = React.useState('');
  const [bathrooms, setBathrooms] = React.useState(0);
  const [bedrooms, setBedrooms] = React.useState([]);
  const [bedCount, setBedCount] = React.useState(0);
  const [bedroomType, setBedroomType] = React.useState('master');
  const [amenities, setAmenities] = React.useState('');
  const [useVideo, setUseVideo] = React.useState(false);
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
          streetDetails, city, state, postcode: parseInt(postcode), country
        },
        price: parseInt(price),
        thumbnail,
        metadata: {
          type,
          bathrooms: parseInt(bathrooms),
          amenities,
          bedrooms,
          images: []
        }
      };
      makeRequest('/listings/new', 'post', body, getters.token).then((res) => {
        if (!('error' in res)) {
          navigate('/mylistings');
        }
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
          value={title}
        />
      </label>
      <br />
      <label>
        Street No. and Name:&nbsp;
        <input
          type="text"
          name="streetNumName"
          onChange={event => setStreetDetails(event.target.value)}
          value={streetDetails}
        />
      </label>
      <br />
      <label>
        City:&nbsp;
        <input
          type="text"
          name="city"
          onChange={event => setCity(event.target.value)}
          value={city}
        />
      </label>
      <br />
      <label>
        State:&nbsp;
        <input
          type="text"
          name="state"
          onChange={event => setState(event.target.value)}
          value={state}
        />
      </label>
      <br />
      <label>
        Postcode:&nbsp;
        <input
          type="number"
          name="postcode"
          onChange={event => setPostcode(event.target.value)}
          value={postcode}
        />
      </label>
      <br />
      <label>
        Country:&nbsp;
        <input
          type="text"
          name="country"
          onChange={event => setCountry(event.target.value)}
          value={country}
        />
      </label>
      <br />
      <label>
        Price (per night):&nbsp;
        <input
          type="number"
          name="price"
          onChange={event => setPrice(event.target.value)}
          value={price}
        />
      </label>
      <br />
      {!useVideo && (<>
        <label>
          Image Thumbnail of Airbnb:&nbsp;
          <input
            type="file"
            name="thumbnail"
            onChange={event => {
              const file = event.target.files[0]
              fileToDataUrl(file).then(result => {
                setThumbnail(result)
              })
            }}
          />
        </label>
        {thumbnail !== '' && (
          <img style={{ height: '50px', width: '50px' }} src={thumbnail}/>
        )}
        <button onClick = {(event) => {
          event.preventDefault();
          setUseVideo(true);
        }}>
          Video Thumbnail
        </button>
      </>)}
      <br />
      {useVideo && (<>
        <label>
        Video Thumbnail of Airbnb
        <input
          type="text"
          name="thumbnail"
          onChange={(event) => {
            setThumbnail(event.target.value)
          }}
        />
        </label>
        <button onClick = {(event) => {
          event.preventDefault();
          setUseVideo(false);
        }}>
          Image Thumbnail
        </button>
        {thumbnail !== '' && useVideo && (
          <iframe style={{ height: '200px', width: '400px' }} src={thumbnail}/>
        )}
      </>)}
      <br />
      <label>
        Type of property:&nbsp;
        <input
          type="text"
          name="type"
          onChange={event => setType(event.target.value)}
          value={type}
        />
      </label>
      <br />
      <label>
        Number of bathrooms:&nbsp;
        <input
          type="number"
          name="bathrooms"
          onChange={event => setBathrooms(event.target.value)}
          value={bathrooms}
        />
      </label>
      <br />
      <div>
        <label>
          Available bedrooms:&nbsp;
          <br />
          Type: &nbsp;
          <select onChange={event => setBedroomType(event.target.value)}>
            {options.map((option, index) => (
              <option key={`bedroom-${index}`} value={option.value}>{option.label}</option>
            ))}
          </select>
          &nbsp;Number of beds:&nbsp;
          <input
            type="number"
            name="bedCount"
            onChange={event => setBedCount(event.target.value)}
            value={bedCount}
          />
          <br />
          <button onClick={(event) => {
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
          value={amenities}
        />
      </label>
      <br />
      <input type="submit" value="Submit" />
    </form>
    <div>
      {bedrooms.length > 0 && (
        bedrooms.map((data, index) => (
          <Bedroom
            key={`bedroom-${index}`}
            bedroomType={data.roomType}
            bedCount={parseInt(data.numBeds)}
            options={options}
            onBedroomTypeChange={(newType) => {
              const newBedrooms = [...bedrooms]
              newBedrooms[index].roomType = newType
              setBedrooms(newBedrooms)
            }}
            onBedCountChange={(newCount) => {
              const newBedrooms = [...bedrooms]
              newBedrooms[index].numBeds = newCount
              setBedrooms(newBedrooms)
            }}
            bedroomDelete={() => {
              const newBedrooms = [...bedrooms]
              newBedrooms.splice(index, 1)
              setBedrooms(newBedrooms)
            }}
          />
        ))
      )}
    </div>
  </div>
  )
}
