// import PropTypes from 'prop-types';
import React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import EditIcon from '../components/Icons/EditIcon';
import CancelIcon from '@mui/icons-material/Cancel';
import {
  useNavigate,
  useParams
} from 'react-router-dom';
import DeleteIcon from '../components/Icons/DeleteIcon';
import TickIcon from '../components/Icons/TickIcon';
import Rating from '@mui/material/Rating';
const MyListings = (props) => {
  const navigate = useNavigate();
  const params = useParams();
  const [listings, setListings] = React.useState([])
  const [oneListing, setOneListing] = React.useState([])
  const [openDelete, setOpenDelete] = React.useState(false);
  const [openUnpublish, setUnpublish] = React.useState(false);
  const [index, setIndex] = React.useState(0);
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
  };

  const listingStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  }
  const fetchListings = async () => {
    const response = await fetch('http://localhost:5005/listings', {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${params.token}`,
      }
    });
    const data = await response.json();
    setListings(data.listings);
    console.log(listings)
    return data.listings
  }

  const fetchOneListing = async (id) => {
    const response = await fetch('http://localhost:5005/listings/' + id, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${params.token}`,
      }
    });
    const data = await response.json();
    if (data.error) {
      alert(data.error)
    } else {
      return data.listing
    }
  }

  const handleOpenDelete = () => setOpenDelete(true);
  const handleCloseDelete = () => setOpenDelete(false);
  const handleOpenUnpublish = () => setUnpublish(true);
  const handleCloseUnpublish = () => setUnpublish(false);
  const deleteListing = async (title) => {
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
      if (title === element.title) {
        id = element.id
      }
    }
    const response = await fetch('http://localhost:5005/listings/' + id, {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${params.token}`,
      }
    });
    const data = await response.json();
    if (data.error) {
      alert(data.error)
    } else {
      renderPage()
    }
  }

  const editListing = (title) => {
    navigate('/listing/my/edit/' + params.email + '/' + params.token + '/' + title)
  }

  const goLive = (title) => {
    navigate('/listing/my/publish/' + params.email + '/' + params.token + '/' + title)
  }

  const renderPage = () => {
    setOneListing([])
    fetchListings().then((l) => {
      for (const element of l) {
        fetchOneListing(element.id).then((i) => {
          if (i.metadata.ownerEmail === params.email) {
            setOneListing(oneListing => [...oneListing, i])
          }
        })
      }
    })
  }

  const unpublish = async (title) => {
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
      if (title === element.title) {
        id = element.id
      }
    }
    const response = await fetch('http://localhost:5005/listings/unpublish/' + id, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${params.token}`,
      }
    });
    const data = await response.json();
    if (data.error) {
      alert(data.error)
    } else {
      renderPage();
    }
  }

  React.useEffect(() => {
    renderPage()

    // function that acepts lsitings
    // map/foreach call fetchonelisting
    // setstate of fetchonelisting result
  }, []);
  return (
    <>
    <Button sx={{ fontSize: '15pt' }} variant="outlined" name="new-listing" onClick={() => { navigate('/listing/my/new/' + params.email + '/' + params.token) }
      }>Create New Listing!</Button>
      {oneListing.map((listing, idx) => {
        return (
          <>
          <div key={idx} style={listingStyle}>
            <h2>Title: {listing.title}</h2>
            <div><span>{listing.address.street + ', ' + listing.address.suburb + ', ' + listing.address.city + ', ' + listing.address.state }</span></div>
            <div>
              <img style={{ maxHeight: '250px', maxWidth: '250px' }} src={listing.thumbnail} alt="thumbnail" />
            </div>
            <div><span style={{ fontWeight: 'bold', textDecorationLine: 'underline' }}>${listing.price} AUD</span></div>
            <div>Type: {listing.metadata.type}</div>
            <div>
              <span>{parseInt(listing.metadata.bedrooms.king) + parseInt(listing.metadata.bedrooms.queen) + parseInt(listing.metadata.bedrooms.single)} · Beds</span>
              &nbsp;
              &nbsp;
              &nbsp;
              <span>{listing.metadata.bathrooms} · Bathrooms</span>
            </div>
            <div><Rating name="half-rating-read" defaultValue={listing.metadata.rating} precision={0.5} readOnly /></div>
            {listing.metadata.reviews && (
              <div>Number of reviews: {listing.metadata.reviews.length}</div>
            )}
            {!listing.metadata.reviews && (
              <div>Number of reviews: 0</div>
            )}
            <Stack key={idx} direction="row" spacing={2}>
              <Button name="edit" variant="contained" startIcon={<EditIcon />} onClick={() => { editListing(oneListing[idx].title) }}>
                Edit
              </Button>
              <Button name="delete" variant="outlined" startIcon={<DeleteIcon />} color="error" onClick={() => { setIndex(idx); handleOpenDelete() }}>
                Delete
              </Button>
              {listing.published && (
                <Button name="unpublish" variant="contained" startIcon={<CancelIcon />} color="info" onClick={() => { setIndex(idx); handleOpenUnpublish() }}>
                  Unpublish
                </Button>
              )}
              {!listing.published && (
                <Button name="publish" variant="contained" startIcon={<TickIcon />} color="secondary" onClick={() => { goLive(oneListing[idx].title) }}>
                  Go live!
                </Button>
              )}
            </Stack>
            {/* modal code from here https://mui.com/material-ui/react-modal/ */}
            <Modal
              aria-labelledby="transition-modal-title"
              aria-describedby="transition-modal-description"
              open={openDelete}
              onClose={handleCloseDelete}
              closeAfterTransition
              BackdropComponent={Backdrop}
              BackdropProps={{
                timeout: 500,
              }}
            >
              <Fade in={openDelete}>
                <Box sx={style} >
                  <Typography id="transition-modal-title" variant="h6" component="h2">
                    {/* delete this title */}
                    Do you want to delete this listing
                  </Typography>
                  <Stack direction="row" spacing={2}>
                    <Button variant="contained" color="success" onClick={() => { deleteListing(oneListing[index].title); handleCloseDelete() }}>
                      Yes
                    </Button>
                    <Button variant="contained" color="error" onClick={handleCloseDelete}>
                      No
                    </Button>
                  </Stack>
                </Box>
              </Fade>
            </Modal>
            <Modal
              aria-labelledby="transition-modal-title"
              aria-describedby="transition-modal-description"
              open={openUnpublish}
              onClose={handleCloseUnpublish}
              closeAfterTransition
              BackdropComponent={Backdrop}
              BackdropProps={{
                timeout: 500,
              }}
            >
              <Fade in={openUnpublish}>
                <Box sx={style} >
                  <Typography id="transition-modal-title" variant="h6" component="h2">
                    {/* delete this title */}
                    Do you want to unpublish this listing
                  </Typography>
                  <Stack direction="row" spacing={2}>
                    <Button name="submit-unpublish" variant="contained" color="success" onClick={() => { unpublish(oneListing[index].title); handleCloseUnpublish() }}>
                      Yes
                    </Button>
                    <Button name="cancel-unpublish" variant="contained" color="error" onClick={handleCloseUnpublish}>
                      No
                    </Button>
                  </Stack>
                </Box>
              </Fade>
            </Modal>
          </div>
          <br />
          <hr />
          </>
        )
      })}
    </>
  )
}
export default MyListings;
