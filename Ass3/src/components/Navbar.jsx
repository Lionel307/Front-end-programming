import React from 'react';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
// import MenuIcon from '@mui/icons-material/Menu';

import {
  useNavigate,
  useLocation,
} from 'react-router-dom';

const Navbar = (props) => {
  const [token, setToken] = React.useState(null);
  const [email, setEmail] = React.useState(null);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  React.useEffect(() => {
    const lsToken = localStorage.getItem('token');
    const lsEmail = localStorage.getItem('email');
    if (lsToken) {
      setToken(lsToken);
      setEmail(lsEmail);
    }
  }, []);

  React.useEffect(() => {
    if (token !== null) {
      if (pathname === '/login' || pathname === '/register') {
        navigate('/dashboard/' + email + '/' + token)
      }
    }
  }, [token]);

  const logout = async () => {
    const response = await fetch('http://localhost:5005/user/auth/logout', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    console.log(data)
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    setToken(null);
    setEmail(null);
    navigate('/')
  }

  const goHome = () => {
    if (token) {
      navigate('/dashboard/' + email + '/' + token)
    } else {
      navigate('/')
    }
  }

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    const lsToken = localStorage.getItem('token');
    const lsEmail = localStorage.getItem('email');
    if (lsToken) {
      setToken(lsToken);
      setEmail(lsEmail);
    }
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
          onClick={goHome}
          >
          {/* <MenuIcon /> */}
            AirBrB
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}></Typography>
          <Button
            id="basic-button"
            name="profile"
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}color="inherit"
          >
            <Avatar src="/broken-image.jpg" />
          </Button>
          {/* menu code is from https://mui.com/material-ui/react-menu/ */}
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          >
            {!token && (
              <>
                <MenuItem name="login" onClick={() => { handleClose(); navigate('/login'); }}>Login</MenuItem>
                <MenuItem name="register" onClick={() => { handleClose(); navigate('/register'); }}>Sign up</MenuItem>
                <MenuItem name="dashboard" onClick={() => { handleClose(); navigate('/'); }}>All Listings</MenuItem>
              </>
            )}
            {token && (
              <>
              <MenuItem name="dashboard" onClick={() => { handleClose(); navigate('/dashboard/' + email + '/' + token); }}>All Listings</MenuItem>
              <MenuItem name="my-listings" onClick={() => { console.log(email); handleClose(); navigate('/listing/my/' + email + '/' + token); }}>My Listings</MenuItem>
              <MenuItem name="logout" onClick={() => { handleClose(); logout(); }}>Logout</MenuItem>
              </>
            )}
          </Menu>
        </Toolbar>
      </AppBar>
    </Box>
    </div>

  );
}

export default Navbar
