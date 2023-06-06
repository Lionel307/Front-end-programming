import React from 'react';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import TextField from '@mui/material/TextField';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import RemoveCircleOutlineRoundedIcon from '@mui/icons-material/RemoveCircleOutlineRounded';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'
// import format from 'date-fns/format'
import { addDays } from 'date-fns'
import { DateRange } from 'react-date-range'

import {
  useParams,
  useNavigate
} from 'react-router-dom';
const Dashboard = () => {
  const [oneListing, setOneListing] = React.useState([])
  const [searchQuery, setSearchQuery] = React.useState('');
  const [searchMinBedroom, setSearchMinBedroom] = React.useState(0);
  const [searchMaxBedroom, setSearchMaxBedroom] = React.useState(0);
  const [searchPrice, setSearchPrice] = React.useState(0);
  const [filtered, setFiltered] = React.useState([])
  const [range, setRange] = React.useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 1),
      key: 'selection'
    }
  ])
  const refOne = React.useRef(null)
  // open close
  // const [open, setOpen] = React.useState(true)
  // get the target element to toggle
  const [searchReview, setSearchReview] = React.useState('');
  const params = useParams();
  const navigate = useNavigate();

  console.log(params.email)
  const fetchListings = async () => {
    const response = await fetch('http://localhost:5005/listings', {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
      }
    });
    const data = await response.json();
    return data.listings
  }

  const fetchOneListing = async (id) => {
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

  const addMinBedroom = () => {
    if (searchMinBedroom === searchMaxBedroom) {
      setSearchMaxBedroom(searchMaxBedroom + 1)
    }
    setSearchMinBedroom(searchMinBedroom + 1)
  }

  const removeMinBedroom = () => {
    if (searchMinBedroom > 0) {
      setSearchMinBedroom(searchMinBedroom - 1)
    }
  }

  const addMaxBedroom = () => {
    setSearchMaxBedroom(searchMaxBedroom + 1)
  }

  const removeMaxBedroom = () => {
    if (searchMaxBedroom > 1) {
      if (searchMinBedroom === searchMaxBedroom) {
        setSearchMinBedroom(searchMinBedroom - 1)
      }
      setSearchMaxBedroom(searchMaxBedroom - 1)
    }
  }

  const [bedroomMenu, setBedroomMenu] = React.useState(null);
  const [priceMenu, setPriceMenu] = React.useState(null);
  const [dateMenu, setDateMenu] = React.useState(null);
  const [reviewMenu, setReviewMenu] = React.useState(null);
  const openBedroom = Boolean(bedroomMenu);
  const openPrice = Boolean(priceMenu);
  const openDate = Boolean(dateMenu);
  const openReview = Boolean(reviewMenu);
  const handleClickBedrooms = (event) => {
    setBedroomMenu(event.currentTarget);
    setSearchQuery('')
    setSearchPrice(0)
    setRange([
      {
        startDate: new Date(),
        endDate: addDays(new Date(), 1),
        key: 'selection'
      }
    ])
  };
  const handleClickPrice = (event) => {
    setPriceMenu(event.currentTarget);
    setSearchMinBedroom(0)
    setSearchMaxBedroom(0)
    setRange([
      {
        startDate: new Date(),
        endDate: addDays(new Date(), 1),
        key: 'selection'
      }
    ])
  };
  const handleClickDate = (event) => {
    setDateMenu(event.currentTarget);
    setSearchPrice(0)
    setSearchMinBedroom(0)
    setSearchMaxBedroom(0)
  };
  const handleClickReview = (event) => {
    setReviewMenu(event.currentTarget);
    setSearchPrice(0)
    setSearchMinBedroom(0)
    setSearchMaxBedroom(0)
    setRange([
      {
        startDate: new Date(),
        endDate: addDays(new Date(), 1),
        key: 'selection'
      }
    ])
  };

  const handleCloseBedrooms = () => {
    setBedroomMenu(null);
  };
  const handleClosePrice = () => {
    setPriceMenu(null);
  };
  const handleCloseDate = () => {
    setDateMenu(null);
  };
  const handleCloseReview = () => {
    setReviewMenu(null);
  };

  const filterData = (query, data) => {
    setFiltered(data.filter(e => e.title === query || e.address.city === query))
  };

  const filterBedroom = (data) => {
    setFiltered(data.filter(e => e.metadata.numBedroom >= searchMinBedroom && e.metadata.numBedroom <= searchMaxBedroom))
  }

  const clearAll = () => {
    setSearchQuery('')
    setSearchMinBedroom(0)
    setSearchMaxBedroom(0)
    setSearchPrice(0)
    setRange([
      {
        startDate: new Date(),
        endDate: addDays(new Date(), 1),
        key: 'selection'
      }
    ])
    renderPage()
  }

  const goListing = (title) => {
    console.log('here')
    navigate('/listing/' + title)
  }

  const renderPage = () => {
    setOneListing([])
    fetchListings().then((l) => {
      l.sort((a, b) => (a.title > b.title) ? 1 : ((b.title > a.title) ? -1 : 0))
      if (searchQuery !== '') {
        console.log('search')
        setOneListing(filtered)
      } else if (searchMaxBedroom !== 0) {
        console.log('bedroom')
        setOneListing(filtered)
      } else if (searchPrice !== 0) {
        console.log('price')
      } else if (searchReview !== '') {
        console.log('review')
      } else {
        for (const element of l) {
          fetchOneListing(element.id).then((i) => {
            if (i.published && i.metadata.ownerEmail !== params.email) {
              setOneListing(oneListing => [...oneListing, i])
            }
          })
        }
      }
    })
  }
  React.useEffect(() => {
    renderPage()
  }, [])

  // search bar is from https://dev.to/marianna13/create-a-search-bar-with-react-and-material-ui-4he
  return (
  <div>
    <br />
    {console.log(searchQuery)}
    <TextField
        id='search-bar'
        className='text'
        onChange={(e) => {
          setSearchQuery(e.target.value);
        }}
        label='Search city/listing'
        variant='outlined'
        placeholder='Search...'
        size='small'
      />
      <IconButton aria-label='search' onClick={() => { renderPage(); filterData(searchQuery, oneListing); }}>
        <SearchIcon style={{ fill: 'blue' }} />
      </IconButton>
      <br />
      Filter by:
      <br />
      <Button id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClickBedrooms}color="inherit"
      >
        Number of Bedrooms
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={bedroomMenu}
        open={openBedroom}
        onClose={handleCloseBedrooms}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <div>
          Min
          <Button>
            <RemoveCircleOutlineRoundedIcon fontSize='small' onClick={removeMinBedroom}></RemoveCircleOutlineRoundedIcon>
          </Button>
          {searchMinBedroom}
          <Button>
            <AddCircleOutlineRoundedIcon fontSize='small' onClick={addMinBedroom}></AddCircleOutlineRoundedIcon>
          </Button>
        </div>
        <div>
          Max
          <Button>
            <RemoveCircleOutlineRoundedIcon fontSize='small' onClick={removeMaxBedroom}></RemoveCircleOutlineRoundedIcon>
          </Button>
          {searchMaxBedroom}
          <Button>
            <AddCircleOutlineRoundedIcon fontSize='small' onChange={() => filterBedroom(oneListing)} onClick={addMaxBedroom}></AddCircleOutlineRoundedIcon>
          </Button>
        </div>
      </Menu>
      {/* dropdown into number textfield */}
      <Button id="basic-button"
        aria-controls={open ? 'price-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClickPrice}color="inherit"
      >
        Price
      </Button>
      <Menu
        id="price-menu"
        anchorEl={priceMenu}
        open={openPrice}
        onClose={handleClosePrice}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <TextField
            type="number"
            InputProps={{ inputProps: { min: 0 } }}
            id="price"
            name="price"
            label="Price per night"
            fullWidth
            variant="standard"
            value={searchPrice}
            onChange={(e) => setSearchPrice(e.target.value)}
          />
      </Menu>
      <Button id="basic-button"
        aria-controls={open ? 'date-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClickDate}color="inherit"
      >
        Dates
      </Button>
      <Menu
        id="date-menu"
        anchorEl={dateMenu}
        open={openDate}
        onClose={handleCloseDate}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        {/* <input
          value={`${format(range[0].startDate, 'MM/dd/yyyy')} to ${format(range[0].endDate, 'MM/dd/yyyy')}`}
          readOnly
          onClick={ () => setOpen(open => !open) }
        /> */}

        <div ref={refOne}>
          {open &&
            <DateRange
              onChange={item => setRange([item.selection])}
              editableDateInputs={true}
              moveRangeOnFirstSelection={false}
              ranges={range}
              months={1}
              direction="horizontal"
              className="calendarElement"
            />
          }
        </div>
        <MenuItem>
        </MenuItem>
      </Menu>
      {/* Same as publish */}
      <Button id="basic-button"
        aria-controls={open ? 'review-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClickReview}color="inherit"
      >
        Reviews
      </Button>
      <Menu
        id="date-menu"
        anchorEl={reviewMenu}
        open={openReview}
        onClose={handleCloseReview}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={() => { setSearchReview('lowest'); handleCloseReview() }}>
          Lowest to Highest
        </MenuItem>
        <MenuItem onClick={() => { setSearchReview('highest'); handleCloseReview() }}>
          Highest to Lowest
        </MenuItem>
      </Menu>
      <button onClick={clearAll}>
        Clear All
      </button>
      {/* dropdown menu lowest to highest and vice versa */}
      <div style={{ display: 'flex', justifyContent: 'space-evenly', flexDirection: 'row' }}>
      {oneListing.map((listing, idx) => {
        return (
          <>
            <div key={idx}>
              <Button disableRipple style={{ display: 'contents' }} onClick={() => goListing(oneListing[idx].title)}>
                <h2>Title: {listing.title}</h2>
                <div>
                  <img style={{ maxHeight: '250px', maxWidth: '250px' }} src={listing.thumbnail} alt="thumbnail" />
                </div>
                <div>
                  <span>{parseInt(listing.metadata.bedrooms.king) + parseInt(listing.metadata.bedrooms.queen) + parseInt(listing.metadata.bedrooms.single)} · Beds</span>
                  &nbsp;
                  &nbsp;
                  &nbsp;
                  <span>{listing.metadata.bathrooms} · Bathrooms</span>
                </div>
                {listing.metadata.reviews && (
                  <div>Number of reviews: {listing.metadata.reviews.length}</div>
                )}
                {!listing.metadata.reviews && (
                  <div>Number of reviews: 0</div>
                )}
              </Button>

            </div>
          </>
        )
      })}
      </div>
  </div>
  )
}

export default Dashboard
