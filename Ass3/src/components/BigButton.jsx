import React from 'react';
import Button from '@mui/material/Button';
import PropTypes from 'prop-types';

const BigButton = (props) => {
  return (
  <Button
    sx={{ fontSize: '15pt' }}
    onClick={props.onClick}
    variant="outlined"
   >
     {props.children}
   </Button>
  );
};

BigButton.propTypes = {
  children: PropTypes.node,
  onClick: PropTypes.func
}

export default BigButton;
