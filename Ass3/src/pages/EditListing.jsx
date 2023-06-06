// import PropTypes from 'prop-types';
import React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import TextField from '@mui/material/TextField';
import FormGroup from '@mui/material/FormGroup';
import Checkbox from '@mui/material/Checkbox';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import ImageUploading from 'react-images-uploading';
import { Button } from '@mui/material';
import {
  useNavigate,
  useParams
} from 'react-router-dom';

const EditListing = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [editListingTitle, setEditListingTitle] = React.useState('');
  const [editListingImg, setEditListingImg] = React.useState(null);
  const [images, setImages] = React.useState([]);
  const [editListingPrice, setEditListingPrice] = React.useState('');
  const [street, setStreet] = React.useState('');
  const [city, setCity] = React.useState('');
  const [suburb, setSuburb] = React.useState('');
  const [state, setState] = React.useState('');
  const [propertyType, setPropertyType] = React.useState('');
  const [bathrooms, setBathrooms] = React.useState(0);
  const [bedrooms, setBedrooms] = React.useState(1);
  const [kingBed, setKingBed] = React.useState(0);
  const [queenBed, setQueenBed] = React.useState(0);
  const [singleBed, setSingleBed] = React.useState(0);
  const [wifi, setWifi] = React.useState(false);
  const [tv, setTv] = React.useState(false);
  const [ac, setAc] = React.useState(false);
  const [addImages, setAddImages] = React.useState(false)
  const showImagesButton = () => setAddImages(true)

  const fetchOneListing = async () => {
    let id = 0
    const response1 = await fetch('http://localhost:5005/listings', {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${params.token}`,
      }
    });
    const data1 = await response1.json();
    const listings = data1.listings
    for (const element of listings) {
      if (params.title === element.title) {
        id = element.id
      }
    }
    const response = await fetch('http://localhost:5005/listings/' + id, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
      }
    });
    const data = await response.json();
    if (data.error) {
      alert(data.error)
    } else {
      return data.listing
    }
  }
  const editListing = async (args) => {
    let id = 0
    const response1 = await fetch('http://localhost:5005/listings', {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${params.token}`,
      }
    });
    const data1 = await response1.json();
    const listings = data1.listings
    for (const element of listings) {
      if (params.title === element.title) {
        id = element.id
      }
    }
    const response = await fetch('http://localhost:5005/listings/' + id, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${params.token}`,
      },
      body: JSON.stringify(args),
    });
    const data = await response.json();
    if (data.error) {
      alert(data.error);
    } else {
      navigate('/listing/my/' + params.email + '/' + params.token)
    }
  }
  const onChange = (imageList) => {
    // data for submit
    setEditListingImg(imageList);
  };

  const changeImage = () => {
    if (editListingImg !== null) {
      setEditListingImg(null)
    }
  }

  const onChangeList = (imageList, addUpdateIndex) => {
    // data for submit
    console.log(imageList, addUpdateIndex);
    setImages(imageList);
  };
  React.useEffect(() => {
    fetchOneListing().then((i) => {
      setEditListingTitle(i.title)
      setEditListingImg(i.thumbnail)
      setImages(i.metadata.images)
      setEditListingPrice(i.price)
      setStreet(i.address.street)
      setSuburb(i.address.suburb)
      setCity(i.address.city)
      setState(i.address.state)
      setPropertyType(i.metadata.type)
      setKingBed(i.metadata.bedrooms.king)
      setQueenBed(i.metadata.bedrooms.queen)
      setSingleBed(i.metadata.bedrooms.single)
      setWifi(i.metadata.amenities.wifi)
      setTv(i.metadata.amenities.tv)
      setAc(i.metadata.amenities.ac)
    })
  }, [])
  return (
    <>
    <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
    <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="editTitle"
            name="editTitle"
            label="Edit Listing Title"
            fullWidth
            variant="standard"
            value={editListingTitle}
            onChange={(e) => setEditListingTitle(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            type="number"
            InputProps={{ inputProps: { min: 0 } }}
            id="price"
            name="price"
            label="Price per night"
            fullWidth
            variant="standard"
            value={editListingPrice}
            onChange={(e) => setEditListingPrice(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="street"
            name="street"
            label="Street"
            fullWidth
            variant="standard"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="suburb"
            name="suburb"
            label="Suburb"
            fullWidth
            variant="standard"
            value={suburb}
            onChange={(e) => setSuburb(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="city"
            name="city"
            label="City"
            fullWidth
            variant="standard"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl name="edit-listing-state" sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="edit-listing-state">State</InputLabel>
            <Select
              labelId="edit-listing-state"
              id="edit-listing-state"
              value={state}
              label="State"
              onChange={(e) => setState(e.target.value)}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem name="NSW" value={'NSW'}>NSW</MenuItem>
              <MenuItem name="QLD" value={'QLD'}>QLD</MenuItem>
              <MenuItem name="VIC" value={'VIC'}>VIC</MenuItem>
              <MenuItem name="NT" value={'NT'}>NT</MenuItem>
              <MenuItem name="TAS" value={'TAS'}>TAS</MenuItem>
              <MenuItem name="SA" value={'SA'}>SA</MenuItem>
              <MenuItem name="WA" value={'WA'}>WA</MenuItem>
              <MenuItem name="ACT" value={'ACT'}>ACT</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl>
          <FormLabel id="new-property-type">Property type</FormLabel>
            <RadioGroup
              row
              aria-labelledby="new-property-type"
              name="row-radio-buttons-group"
              onChange={(e) => setPropertyType(e.target.value)}
            >
            <FormControlLabel name="house" value="House" control={<Radio />} label="House" />
            <FormControlLabel name="apartment" value="Apartment" control={<Radio />} label="Apartment" />
            <FormControlLabel name="bed-and-breakfast" value="Bed-and-breakfast" control={<Radio />} label="Bed and Breakfast" />
          </RadioGroup>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          Number of bathrooms:
          <Box sx={{ width: 300 }}>
            <Slider
              aria-label="Number of Bathrooms"
              name="bathrooms"
              defaultValue={1}
              valueLabelDisplay="auto"
              step={1}
              marks
              min={1}
              max={10}
              onChange={(e) => setBathrooms(e.target.value)}
            />
          </Box>
        </Grid>
        <Grid item xs={12}>
          Number of bedrooms:
          <Box sx={{ width: 300 }}>
            <Slider
              aria-label="Number of Bedrooms"
              name="bedrooms"
              defaultValue={1}
              valueLabelDisplay="auto"
              step={1}
              marks
              min={1}
              max={10}
              onChange={(e) => setBedrooms(e.target.value)}
            />
          </Box>
          Type of bedrooms:<br />
          <Box sx={{ width: 300, display: 'flex' }}>
            <TextField
              type="number"
              name="king"
              label="King Beds"
              variant="filled"
              value={kingBed}
              InputProps={{ inputProps: { min: 0 } }}
              onChange={(e) => setKingBed(e.target.value)}
            />
            <TextField
              type="number"
              name="queen"
              label="Queen Beds"
              variant="filled"
              value={queenBed}
              InputProps={{ inputProps: { min: 0 } }}
              onChange={(e) => setQueenBed(e.target.value)}
            />
            <TextField
              type="number"
              name="single"
              label="Single Beds"
              InputProps={{ inputProps: { min: 0 } }}
              variant="filled"
              value={singleBed}
              onChange={(e) => setSingleBed(e.target.value)}
            />
          </Box>
        </Grid>
        <Grid item xs={12}>
          Amenities:
          <FormGroup sx={{ display: 'flex', flexDirection: 'row' }}>
            <FormControlLabel name="wifi" value={wifi} onChange={(e) => setWifi(!wifi)} control={<Checkbox />} label="Wi-Fi" />
            <FormControlLabel name="tv" value={tv} onChange={(e) => setTv(!tv)} control={<Checkbox />} label="TV" />
            <FormControlLabel name="ac" value={ac} onChange={(e) => setAc(!ac)} control={<Checkbox />} label="AC" />
          </FormGroup>
        </Grid>
        <Grid item xs={12}>
          {/* upload code is from here https://codesandbox.io/s/react-images-uploading-demo-forked-hfloz6?file=/src/index.js:201-203 */}
          <ImageUploading
            multiple
            value={editListingImg}
            onChange={onChange}
            dataURLKey="data_url"
            acceptType={['jpg', 'png', 'jpeg']}
          >
            {({
              imageList,
              onImageUpload,
              onImageRemoveAll,
              isDragging,
              dragProps
            }) => (
              // write your building UI
              <div className="upload__image-wrapper">
                <Button
                  variant="contained"
                  name="thumnbnail"
                  style={isDragging ? { color: 'red' } : null}
                  onClick={() => { changeImage(); onImageUpload(); }}
                  {...dragProps}
                >
                  Change thumbnail
                </Button>

                { editListingImg && (
                  <img src={editListingImg[0].data_url} alt="" style={{ paddingLeft: '25px', maxWidth: '150px' }}/>
                )}
              </div>
            )}
        </ImageUploading>
        <br />
        { !addImages && (
          <Button variant="contained" onClick={showImagesButton}>See Property Images</Button>
        )}
        { addImages && (
        <ImageUploading
            multiple
            value={images}
            onChange={onChangeList}
            dataURLKey="data_url"
            acceptType={['jpg', 'png', 'jpeg']}
          >
            {({
              imageList,
              onImageUpload,
              onImageRemoveAll,
              onImageUpdate,
              onImageRemove,
              isDragging,
              dragProps
            }) => (
              // write your building UI
              <div className="upload__image-wrapper">
                <Button
                  variant="contained"
                  style={isDragging ? { color: 'red' } : null}
                  onClick={() => { onImageUpload(); }}
                  {...dragProps}
                >
                  Add Property Images
                </Button>
                &nbsp;
                <Button variant="contained" color="error" onClick={onImageRemoveAll}>Remove all property images</Button>
                {imageList.map((image, index) => (
                  <div key={index} className="image-item">
                    <img src={image.data_url} alt="" width="100" />
                    <div className="image-item__btn-wrapper">
                      <Button onClick={() => onImageUpdate(index)}>Update</Button>
                      <Button color="error" onClick={() => onImageRemove(index)}>Remove</Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
        </ImageUploading>
        )}
        </Grid>
        <Grid item xs={12}>
          <Button sx={{ fontSize: '15pt' }} variant="outlined" name="edit-listing" onClick={() => {
            editListing({
              title: editListingTitle,
              address: { street: street, suburb: suburb, city: city, state: state },
              price: editListingPrice,
              thumbnail: editListingImg[0].data_url,
              metadata: {
                type: propertyType,
                ownerEmail: params.email,
                images: images,
                rating: 0,
                bathrooms: bathrooms,
                numBedrooms: bedrooms,
                amenities: {
                  wifi: wifi,
                  tv: tv,
                  ac: ac
                },
                bedrooms: {
                  king: kingBed,
                  queen: queenBed,
                  single: singleBed
                }
              }
            })
          }}>Edit!</Button>
        </Grid>
      </Grid>
    </Container>
    </>
  )
}
export default EditListing;

// edit listing
// fix displaying listings
// publish listing
