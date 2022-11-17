import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { contextVariables } from '../helpers/contextVariables';
import makeRequest from '../helpers/makeRequest';
import Bedroom from '../components/Bedroom';
import { fileToDataUrl } from '../helpers/imageToURLHelper';
import ImageDeleteButton from '../components/ImageDeleteButton';
// From material ui
import { Box, Button, TextField, MenuItem, Select, Alert } from '@mui/material';

// // This page allows for listing editing where all fields are required

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
  const [emptyFieldAlert, setEmptyFieldAlert] = React.useState(false);
  const [bedNumAlert, setBedNumAlert] = React.useState(false);
  const params = useParams();
  React.useEffect(() => {
    makeRequest(`/listings/${params.lId}`, 'get', undefined, getters.token).then((res) => {
      const listing = res.listing;
      setTitle(listing.title);
      setStreetDetails(listing.address.streetDetails);
      setCity(listing.address.city);
      setState(listing.address.state);
      setPostcode(listing.address.postcode);
      setCountry(listing.address.country);
      setPrice(listing.price);
      setThumbnail(listing.thumbnail);
      if (listing.thumbnail.includes('https://www.youtube.com/embed/')) {
        setUseVideo(true);
      }
      setType(listing.metadata.type);
      setBathrooms(listing.metadata.bathrooms);
      setBedrooms(listing.metadata.bedrooms);
      setAmenities(listing.metadata.amenities);
      setImages(listing.metadata.images);
    })
  }, [])
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <form
        style={{
          border: 'solid',
          borderColor: '#bfbfbf',
          borderWidth: '0.1vh',
          borderRadius: '5px',
          padding: '10px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '80%',
          margin: '20px'
        }}
        onSubmit={(e) => {
          e.preventDefault();
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
            setEmptyFieldAlert(true);
          }
        }}>
        <h3 style={{ color: '#4377cf' }}>
          Edit Listing
        </h3>
        <TextField
          label="Title"
          variant="outlined"
          name="title"
          onChange={event => setTitle(event.target.value)}
          value={title}
          type="text"
        />
        <br />
        <TextField
          label="Street No. and Name"
          variant="outlined"
          name="streetNumName"
          onChange={event => setStreetDetails(event.target.value)}
          value={streetDetails}
          type="text"
        />
        <br />
        <TextField
          label="City"
          variant="outlined"
          name="city"
          onChange={event => setCity(event.target.value)}
          value={city}
          type="text"
        />
        <br />
        <TextField
          label="State"
          variant="outlined"
          name="state"
          onChange={event => setState(event.target.value)}
          value={state}
          type="text"
        />
        <br />
        <TextField
          label="Postcode"
          variant="outlined"
          name="postcode"
          onChange={event => setPostcode(event.target.value)}
          value={postcode}
          type="text"
        />
        <br />
        <TextField
          label="Country"
          variant="outlined"
          name="country"
          onChange={event => setCountry(event.target.value)}
          value={country}
          type="text"
        />
        <br />
        <TextField
          label="Price"
          variant="outlined"
          name="price"
          onChange={event => setPrice(event.target.value)}
          value={price}
          type="text"
        />
        <br />
        {!useVideo && (<div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <div>
            <Button style={{ borderWidth: '0.3vh', fontWeight: 'bold', margin: '10px' }}
              name='video-thumbnail-button'
              onClick={(event) => {
                event.preventDefault();
                setUseVideo(true);
              }}
              variant="outlined">
              Use Video Thumbnail
            </Button>
          </div>
          <Button style={{ margin: '10px' }} variant="contained" component="label">
            Upload Image
            <input
              type="file"
              name="thumbnail"
              hidden
              onChange={event => {
                const file = event.target.files[0]
                fileToDataUrl(file).then(result => {
                  setThumbnail(result);
                });
              }}
            />
          </Button>
        </div>)}
        {useVideo && (<div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <div>
            <Button style={{ borderWidth: '0.3vh', fontWeight: 'bold', margin: '10px' }}
              onClick={(event) => {
                event.preventDefault();
                setUseVideo(false);
              }}
              variant="outlined">
              Use Image Thumbnail
            </Button>
          </div>
          <TextField
            label="Youtube Video URL"
            variant="outlined"
            name="Vthumbnail"
            onChange={event => setThumbnail(`http://img.youtube.com/vi/${event.target.value.split('=')[1]}/0.jpg`)}
            type="text"
          />
        </div>)}
        {thumbnail !== '' && (
          <img style={{ height: '300px', width: '300px' }} src={thumbnail} alt={'Thumbnail Image'} />
        )}
        <br />
        <TextField
          label="Type of property"
          variant="outlined"
          name="type"
          onChange={event => setType(event.target.value)}
          value={type}
          type="text"
        />
        <br />
        <TextField
          label="Number of bathrooms"
          variant="outlined"
          name="bathrooms"
          onChange={event => setBathrooms(event.target.value)}
          value={bathrooms}
          type="text"
        />
        <br />
        <div
          style={{
            border: 'solid',
            borderColor: '#bfbfbf',
            borderWidth: '0.1vh',
            borderRadius: '5px',
            padding: '10px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '300px'
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              width: '300px'
            }}
          >
            <Select
              value={bedroomType}
              onChange={event => setBedroomType(event.target.value)}
            >
              <MenuItem value={'master'}>Master</MenuItem>
              <MenuItem value={'children'}>Children</MenuItem>
              <MenuItem value={'guest'}>Guest</MenuItem>
            </Select>
            <br />
            <TextField
              label="Number of beds"
              variant="outlined"
              name="bedCount"
              onChange={event => setBedCount(event.target.value)}
              value={bedCount}
              type="number"
            />
          </div>
          <Button
            style={{ margin: '10px' }}
            variant="contained"
            onClick={(event) => {
              event.preventDefault();
              const newBedrooms = bedrooms;
              // if bedcount is nothing or 0, dont allow pushing on. get an error up or alert
              if (bedCount !== '' && bedCount > 0) {
                newBedrooms.push({ roomType: bedroomType, numBeds: bedCount });
                setBedrooms(newBedrooms);
                setBedCount(0);
                setBedroomType(bedroomType);
                setBedNumAlert(false);
              } else {
                setBedNumAlert(true);
              }
            }}
          >
            Add Bedroom
          </Button>
          {bedNumAlert && (
            <Alert severity="error">Invalid Bed Number</Alert>
          )}
          {bedrooms.length > 0 && (
            <h3 style={{ color: '#4377cf' }}>
              Bedrooms Below
            </h3>
          )}
          <div>
          {
            bedrooms.map((data, index) => (
              <Bedroom
                key={`bedroom-${index}`}
                bedroomType={data.roomType}
                bedCount={data.numBeds}
                onBedroomTypeChange={(newType) => {
                  const newBedrooms = [...bedrooms];
                  newBedrooms[index].roomType = newType;
                  setBedrooms(newBedrooms);
                }}
                onBedCountChange={(newCount) => {
                  const newBedrooms = [...bedrooms];
                  newBedrooms[index].numBeds = newCount;
                  setBedrooms(newBedrooms);
                }}
                bedroomDelete={() => {
                  const newBedrooms = [...bedrooms];
                  newBedrooms.splice(index, 1);
                  setBedrooms(newBedrooms);
                }}
              />
            ))
          }
        </div>
        </div>
        <br />
        <Button style={{ margin: '10px' }} variant="contained" component="label">
          Add Property Images
          <input
            type="file"
            name="images"
            hidden
            onChange={event => {
              const file = event.target.files[0];
              fileToDataUrl(file).then(result => {
                const newImages = [...images];
                newImages.push(result);
                setImages(newImages);
              })
            }}
          />
        </Button>
        {
          images.map((img, index) => (
            <div key={`image-${index}`}>
              <img style={{ height: '50px', width: '50px' }} src={img} alt={'Thumbnail Image'} />
              <ImageDeleteButton images={images} imagesSetter={setImages} img={img}
              />
            </div>
          ))
        }
        <br />
        <TextField
          label="Amenities"
          variant="outlined"
          name="amenities"
          onChange={event => setAmenities(event.target.value)}
          value={amenities}
          type="text"
        />
        <br />
        <Button style={{ margin: '10px' }} variant="contained" component="label" name='edit-listing-button'>
          Save Changes
          <input
            type="submit"
            hidden
          />
        </Button>
        {emptyFieldAlert && (
          <Alert severity="error">One or more fields are empty. Please fill them. </Alert>
        )}
      </form>
    </Box>
  )
}
