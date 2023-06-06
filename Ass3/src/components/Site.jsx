import React from 'react';
import Register from '../pages/Register';
import Login from '../pages/Login';
import ListingNew from '../pages/ListingNew';
import MyListings from '../pages/MyListings';
import Dashboard from '../pages/Dashboard';
import Navbar from './Navbar';

import {
  // BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import EditListing from '../pages/EditListing';
import PublishListing from '../pages/PublishListing';
import Listing from '../pages/Listing';

function Site () {
  const [token, setToken] = React.useState(null);
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login setTokenFn={setToken}/>} />
        <Route path="/register" element={<Register setTokenFn={setToken}/>} />
        <Route path="/listing" element={<MyListings token={token}/>} />
        <Route path="/listing/:title" element={<Listing token={token}/>} />
        <Route path="/listing/my" element={<MyListings token={token}/>} />
        <Route path="/listing/my/:email/:token" element={<MyListings token={token}/>} />
        <Route path="/listing/my/edit/" element={<EditListing token={token}/>} />
        <Route path="/listing/my/edit/:email/:token/:title" element={<EditListing token={token}/>} />
        <Route path="/listing/my/publish/" element={<PublishListing token={token}/>} />
        <Route path="/listing/my/publish/:email/:token/:title" element={<PublishListing token={token}/>} />
        <Route path="/listing/my/new" element={<ListingNew token={token}/>} />
        <Route path="/listing/my/new/:email/:token" element={<ListingNew token={token}/>} />
        <Route path="/dashboard/:email/:token" element={<Dashboard />} />
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </div>
  );
}

export default Site;
