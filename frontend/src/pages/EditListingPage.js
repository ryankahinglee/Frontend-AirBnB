import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { contextVariables } from '../contextVariables';
import makeRequest from '../makeRequest';
import Bedroom from '../components/Bedroom';
import { fileToDataUrl } from '../imageToURLHelper';
import Cross from '../components/Cross';

export default function EditListing () {
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
  const [amenities, setAmenities] = React.useState('');
  const [images, setImages] = React.useState([]);
  const [bedCount, setBedCount] = React.useState(0);
  const [bedroomType, setBedroomType] = React.useState('master');
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
  const params = useParams();
  React.useEffect(() => {
    makeRequest(`/listings/${params.lId}`, 'get', undefined, getters.token).then((res) => {
      const listing = res.listing
      setTitle(listing.title)
      setStreetDetails(listing.address.streetDetails)
      setCity(listing.address.city)
      setState(listing.address.state)
      setPostcode(listing.address.postcode)
      setCountry(listing.address.country)
      setPrice(listing.price)
      setThumbnail(listing.thumbnail)
      if (listing.thumbnail.includes('https://www.youtube.com/embed/')) {
        setUseVideo(true);
      }
      setType(listing.metadata.type)
      setBathrooms(listing.metadata.bathrooms)
      setBedrooms(listing.metadata.bedrooms)
      setAmenities(listing.metadata.amenities)
      setImages(listing.metadata.images)
    })
  }, [])
  return (<div>
    <form onSubmit={(e) => {
      e.preventDefault();
      // form checking here that price, bathrooms, postcode, all bedroom counts are not empty
      let numBedFieldEmpty = false;
      for (const bedroom of bedrooms) {
        if (bedroom.numBeds === '') {
          numBedFieldEmpty = true;
          break;
        }
      }
      const body = {
        title,
        address: {
          streetDetails,
          city,
          state,
          postcode: parseInt(postcode),
          country
        },
        price: parseInt(price),
        thumbnail,
        metadata: {
          type,
          bathrooms: parseInt(bathrooms),
          amenities,
          bedrooms,
          images
        }
      };
      if (
        title !== '' &&
        streetDetails !== '' &&
        city !== '' && state !== '' &&
        postcode !== '' &&
        country !== '' &&
        price !== '' &&
        thumbnail !== '' &&
        type !== '' &&
        bathrooms !== '' &&
        amenities !== '' && !numBedFieldEmpty
      ) {
        makeRequest(`/listings/${params.lId}`, 'put', body, getters.token).then((res) => {
          if (!('error' in res)) {
            navigate('/mylistings');
          }
        })
      } else {
        alert('Please ensure all fields are non-empty')
      }
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
      <br/>
      <label>
        Street No. and Name:&nbsp;
        <input
          type="text"
          name="streetNumName"
          onChange={event => setStreetDetails(event.target.value)}
          value={streetDetails}
        />
      </label>
      <br/>
      <label>
        City:&nbsp;
        <input
          type="text"
          name="city"
          onChange={event => setCity(event.target.value)}
          value={city}
        />
      </label>
      <br/>
      <label>
        State:&nbsp;
        <input
          type="text"
          name="state"
          onChange={event => setState(event.target.value)}
          value={state}
        />
      </label>
      <br/>
      <label>
        Postcode:&nbsp;
        <input
          type="number"
          name="postcode"
          onChange={event => setPostcode(event.target.value)}
          value={postcode}
        />
      </label>
      <br/>
      <label>
        Country:&nbsp;
        <input
          type="text"
          name="country"
          onChange={event => setCountry(event.target.value)}
          value={country}
        />
      </label>
      <br/>
      <label>
        Price (per night):&nbsp;
        <input
          type="number"
          name="price"
          onChange={event => setPrice(event.target.value)}
          value={price}
        />
      </label>
      <br/>
      {!useVideo && (<div>
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
        <button onClick = {(event) => {
          event.preventDefault();
          setUseVideo(true);
        }}>
          Use Video Thumbnail
        </button>
      </div>)}
      {useVideo && (<div>
        <label>
        Video Thumbnail of Airbnb (Please Input Youtube URL Link):
        <input
          type="text"
          name="thumbnail"
          onChange={(event) => {
            setThumbnail(`http://img.youtube.com/vi/${event.target.value.split('=')[1]}/0.jpg`)
          }}
        />
        </label>
        <button onClick = {(event) => {
          event.preventDefault();
          setUseVideo(false);
        }}>
          Use Image Thumbnail
        </button>
      </div>)}
      {thumbnail !== '' && (
          <img style={{ height: '300px', width: '300px' }} src={thumbnail}/>
      )}
      <br/>
      <label>
        Type of property:&nbsp;
        <input
          type="text"
          name="type"
          onChange={event => setType(event.target.value)}
          value={type}
        />
      </label>
      <br/>
      <label>
        Number of bathrooms:&nbsp;
        <input
          type="number"
          name="bathrooms"
          onChange={event => setBathrooms(event.target.value)}
          value={bathrooms}
        />
      </label>
      <br/>
      <div>
        <label>
          Available bedrooms:&nbsp;
          <br/>
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
          <br/>
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
      <br/>
      <label>
        Add Property Images:&nbsp;
        <input
          type="file"
          name="images"
          onChange={event => {
            const file = event.target.files[0]
            fileToDataUrl(file).then(result => {
              const newImages = [...images]
              newImages.push(result)
              setImages(newImages)
            })
          }}
        />
      </label>
      {
        images.map((img, index) => (
          <div key={`image-${index}`}>
            <img style={{ height: '50px', width: '50px' }} src={img}/>
            <Cross images={images} imagesSetter={setImages} img={img}
            />
          </div>
        ))
      }
      <br/>
      <label>
        Amenities:&nbsp;
        <input
          type="text"
          name="amenities"
          onChange={event => setAmenities(event.target.value)}
          value={amenities}
        />
      </label>
      <br/>
      <input type="submit" value="Submit" />
    </form>
    <div>
      {bedrooms.length > 0 && (
        bedrooms.map((data, index) => (
          <Bedroom
            key={`bedroom-${index}`}
            bedroomType={data.roomType}
            bedCount={data.numBeds}
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
