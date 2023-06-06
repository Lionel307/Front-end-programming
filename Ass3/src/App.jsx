import React from 'react';
import Site from './components/Site';
import {
  BrowserRouter as Router,
} from 'react-router-dom';

// const Home = () => {
//   return <div>Home</div>
// }

function App () {
  return (
    <Router>
      <Site />
    </Router>
  );
}

export default App;
