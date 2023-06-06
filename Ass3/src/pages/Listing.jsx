import React from 'react';
import Rating from '@mui/material/Rating';
import WifiIcon from '@mui/icons-material/Wifi';
import TvIcon from '@mui/icons-material/Tv';
import AcUnitIcon from '@mui/icons-material/AcUnit';
// import Button from '@mui/material/Button';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
// import ImageGallery from 'react-image-gallery';
import {
  useParams
} from 'react-router-dom';
import '../style.css';
import { IconButton } from '@mui/material';
const Listing = () => {
  const params = useParams();
  const [oneListing, setOneListing] = React.useState('')
  const [images, setImages] = React.useState([])
  const [idx, setIdx] = React.useState(0)
  const listingStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  }
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
      setOneListing(data.listing)
      return data.listing
    }
  }

  const imageRight = () => {
    if (idx < images.length - 1) {
      setIdx(idx + 1)
    }
  }
  const imageLeft = () => {
    if (idx > 0) {
      setIdx(idx - 1)
    }
  }

  React.useEffect(() => {
    fetchOneListing().then((i) => {
      setImages(images => [...images, i.thumbnail])
      for (const photo in i.metadata.images) {
        const image = i.metadata.images[photo[0]].data_url
        setImages(images => [...images, image])
      }
    })
  }, [])
  return (
    <div style={listingStyle}>
    <div>
      <img src={images[idx]} alt="images" />
      <div>{idx + 1}/{images.length}</div>
      <div>
        <IconButton onClick={imageLeft}><KeyboardArrowLeftIcon/></IconButton>
        <IconButton onClick={imageRight}><KeyboardArrowRightIcon/></IconButton>
      </div>
      <h2>Title: {oneListing.title}</h2>
      <div><span>{oneListing.address?.street + ', ' + oneListing.address?.suburb + ', ' + oneListing.address?.city + ', ' + oneListing.address?.state }</span></div>
      <br />
      <div><span style={{ fontWeight: 'bold', textDecorationLine: 'underline' }}>${oneListing.price} AUD</span></div>
      <br />
      <div>Type: {oneListing.metadata?.type}</div>
      <br />
      <div>{oneListing.metadata?.numBedrooms} · bedrooms</div>
      <div>
        <span>{parseInt(oneListing.metadata?.bedrooms?.king) + parseInt(oneListing.metadata?.bedrooms?.queen) + parseInt(oneListing.metadata?.bedrooms?.single)} · Beds</span>
        &nbsp;
        &nbsp;
        &nbsp;
        <span>{oneListing.metadata?.bathrooms} · Bathrooms</span>
      </div>
      <br />
      <div><Rating name="half-rating-read" defaultValue={oneListing.metadata?.rating} precision={0.5} readOnly /></div>
      <br />
      {oneListing.metadata?.amenities.wifi && (
        <span><WifiIcon/>Wi-Fi &nbsp;</span>
      )}
      {!oneListing.metadata?.amenities.wifi && (
        <span><WifiIcon/><s>Wi-Fi</s> &nbsp;</span>
      )}
      {oneListing.metadata?.amenities.tv && (
        <span><TvIcon/>TV &nbsp;</span>
      )}
      {!oneListing.metadata?.amenities.tv && (
        <span><TvIcon/><s>TV</s> &nbsp;</span>
      )}
      {oneListing.metadata?.amenities.ac && (
        <span><AcUnitIcon/>Air conditioning &nbsp;</span>
      )}
      {!oneListing.metadata?.amenities.ac && (
        <span><AcUnitIcon/><s>Air conditioning</s> &nbsp;</span>
      )}
      <br />
      {oneListing.metadata?.reviews && (
        <div>Number of reviews: {oneListing.metadata.reviews.length}</div>
      )}
      {!oneListing.metadata?.reviews && (
        <div>Reviews: none</div>
      )}
    </div>
    </div>
  );
}

export default Listing;
