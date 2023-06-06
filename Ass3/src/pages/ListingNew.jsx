import PropTypes from 'prop-types';
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
import Button from '@mui/material/Button';
import ImageUploading from 'react-images-uploading';
import {
  useNavigate,
  useParams
} from 'react-router-dom';

const ListingNew = (props) => {
  const navigate = useNavigate();
  const params = useParams();
  const [newListingTitle, setNewListingTitle] = React.useState('');
  const [newListingPrice, setNewListingPrice] = React.useState('');
  const [newListingImg, setNewListingImg] = React.useState(null);
  const [street, setStreet] = React.useState('');
  const [city, setCity] = React.useState('');
  const [suburb, setSuburb] = React.useState('');
  const [state, setState] = React.useState('');
  const [propertyType, setPropertyType] = React.useState('');
  const [bathrooms, setBathrooms] = React.useState(1);
  const [bedrooms, setBedrooms] = React.useState(1);
  const [kingBed, setKingBed] = React.useState(0);
  const [queenBed, setQueenBed] = React.useState(0);
  const [singleBed, setSingleBed] = React.useState(0);
  const [wifi, setWifi] = React.useState(false);
  const [tv, setTv] = React.useState(false);
  const [ac, setAc] = React.useState(false);

  const newListing = async (args) => {
    const response = await fetch('http://localhost:5005/listings/new', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${params.token}`,
      },
      body: JSON.stringify(args),
    });
    const data = await response.json();
    if (data.error) {
      alert(data.error);
      console.log(props.token)
    } else {
      navigate('/listing/my/' + params.email + '/' + params.token)
    }
  }

  const onChange = (imageList) => {
    // data for submit
    console.log(imageList);
    setNewListingImg(imageList);
  };

  const changeImage = () => {
    if (newListingImg !== null) {
      setNewListingImg(null)
    }
    console.log(newListingImg)
  }

  return (
    <>
    <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
    <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="newTitle"
            name="newTitle"
            aria-label='new listing title'
            label="New Listing Title"
            fullWidth
            variant="standard"
            value={newListingTitle}
            onChange={(e) => setNewListingTitle(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            type="number"
            InputProps={{ inputProps: { min: 0 } }}
            id="price"
            name="price"
            aria-label='Price per night'
            label="Price per night"
            fullWidth
            variant="standard"
            value={newListingPrice}
            onChange={(e) => setNewListingPrice(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="street"
            name="street"
            aria-label='street'
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
            aria-label='suburb'
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
            aria-label='city'
            label="City"
            fullWidth
            variant="standard"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl name="new-listing-state" sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="new-listing-state">State</InputLabel>
            <Select
              labelId="new-listing-state"
              aria-label='state'
              id="new-listing-state"
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
          <FormLabel aria-label="property type" id="new-property-type">Property type</FormLabel>
            <RadioGroup
              row
              aria-labelledby="new-property-type"
              name="row-radio-buttons-group"
              onChange={(e) => setPropertyType(e.target.value)}
            >
            <FormControlLabel aria-label='house' name="house" value="House" control={<Radio />} label="House" />
            <FormControlLabel aria-label='apartment' name="apartment" value="Apartment" control={<Radio />} label="Apartment" />
            <FormControlLabel aria-label='bed and breakfast' name="bed-and-breakfast" value="Bed-and-breakfast" control={<Radio />} label="Bed and Breakfast" />
          </RadioGroup>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          Number of bathrooms:
          <Box sx={{ width: 300 }}>
            <Slider
              aria-label="Number of Bathrooms"
              name="bathroom"
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
              name="bedrooms"
              aria-label="Number of Bedrooms"
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
              aria-label='number of king beds'
              variant="filled"
              value={kingBed}
              InputProps={{ inputProps: { min: 0 } }}
              onChange={(e) => setKingBed(e.target.value)}
            />
            <TextField
              type="number"
              name="queen"
              label="Queen Beds"
              aria-label='number of queen beds'
              variant="filled"
              value={queenBed}
              InputProps={{ inputProps: { min: 0 } }}
              onChange={(e) => setQueenBed(e.target.value)}
            />
            <TextField
              type="number"
              name="single"
              label="Single Beds"
              aria-label='number of single beds'
              InputProps={{ inputProps: { min: 0 } }}
              variant="filled"
              value={singleBed}
              onChange={(e) => setSingleBed(e.target.value)}
            />
          </Box>
        </Grid>
        <Grid aria-label="Amenities" item xs={12}>
          Amenities:
          <FormGroup sx={{ display: 'flex', flexDirection: 'row' }}>
            <FormControlLabel aria-label='wi-fi' name="wifi" value={wifi} onChange={(e) => setWifi(!wifi)} control={<Checkbox />} label="Wi-Fi" />
            <FormControlLabel aria-label='tv' name="tv" value={tv} onChange={(e) => setTv(!tv)} control={<Checkbox />} label="TV" />
            <FormControlLabel aria-label='air conditioning' name="ac" value={ac} onChange={(e) => setAc(!ac)} control={<Checkbox />} label="AC" />
          </FormGroup>
        </Grid>
        <Grid item xs={12}>
          {/* upload code is from here https://codesandbox.io/s/react-images-uploading-demo-forked-hfloz6?file=/src/index.js:201-203 */}
          <ImageUploading
            multiple
            value={newListingImg}
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
                  type='file'
                  name="thumbnail"
                  aria-label='thumbnail'
                  label="thumbnail"
                  style={isDragging ? { color: 'red' } : null}
                  onClick={() => { changeImage(); onImageUpload(); }}
                  {...dragProps}
                >
                  Add thumbnail
                </Button>

                { newListingImg && (
                  <img src={newListingImg[0].data_url} alt="" width="45%" style={{ paddingLeft: '25px' }}/>
                )}
              </div>
            )}
        </ImageUploading>
        </Grid>
        <Grid item xs={12}>
          <Button aria-label='submit new listing' sx={{ fontSize: '15pt' }} variant="outlined" name="create-new-listing" onClick={() => {
            newListing({
              title: newListingTitle,
              address: { street: street, suburb: suburb, city: city, state: state },
              price: newListingPrice,
              thumbnail: newListingImg[0].data_url,
              metadata: {
                type: propertyType,
                ownerEmail: params.email,
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
          }}>Create!</Button>
        </Grid>
      </Grid>
    </Container>
    </>
  );
}

export default ListingNew;

ListingNew.propTypes = {
  token: PropTypes.string,
};
