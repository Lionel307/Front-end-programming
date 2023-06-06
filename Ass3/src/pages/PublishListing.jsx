import React from 'react'
import { DateRange } from 'react-date-range'
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

import format from 'date-fns/format'
import { addDays } from 'date-fns'
import {
  useNavigate,
  useParams
} from 'react-router-dom';
import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'

const PublishListing = () => {
  const params = useParams();
  const navigate = useNavigate();
  const dates = React.useRef([])
  const [range, setRange] = React.useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 1),
      key: 'selection'
    }
  ])

  // open close
  const [open, setOpen] = React.useState(true)

  // get the target element to toggle
  const refOne = React.useRef(null)

  const style = {
    display: 'flex',
    position: 'absolute',
    left: '40%',
    top: '14%',
    width: '353px',
    justifyContent: 'center',
    flexDirection: 'column',
  };

  const addDates = (date) => {
    const datePeriod = {
      start: date[0].startDate,
      end: date[0].endDate
    }
    setRange([
      {
        startDate: date[0].endDate,
        endDate: addDays(date[0].endDate, 1),
        key: 'selection'
      }
    ])
    dates.current.push(datePeriod)
  }

  const submitPublish = async () => {
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
    const response = await fetch('http://localhost:5005/listings/publish/' + id, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${params.token}`,
      },
      body: JSON.stringify({
        availability: dates.current
      }),
    });
    const data = await response.json();
    if (data.error) {
      alert(data.error);
    } else {
      navigate('/listing/my/' + params.email + '/' + params.token)
    }
  }
  return (
    <>
    <div>
      <Box sx={style}>
        <h2>Add availability</h2>
        <input
          value={`${format(range[0].startDate, 'MM/dd/yyyy')} to ${format(range[0].endDate, 'MM/dd/yyyy')}`}
          readOnly
          onClick={ () => setOpen(open => !open) }
        />

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
        <Button name="add-dates" variant="contained" onClick={() => { addDates(range) }}>
          Add
        </Button>
        <br />
        <Button name="publish" variant="contained" onClick={() => { submitPublish() }}>
          Publish
        </Button>
    </Box>

    </div>

    </>
  )
}

export default PublishListing;

// add list of selected availabilties
