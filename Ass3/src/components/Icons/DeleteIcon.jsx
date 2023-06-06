import * as React from 'react';
import SvgIcon from '@mui/material/SvgIcon';

function DeleteIcon (props) {
  return (
    <SvgIcon {...props}>
      <path d="M 6 19 c 0 1.1 0.9 2 2 2 h 8 c 1.1 0 2 -0.9 2 -2 V 7 H 6 v 12 Z M 19 4 h -3.5 l -1 -1 h -5 l -1 1 H 5 v 2 h 14 V 4 Z" />
    </SvgIcon>
  );
}

DeleteIcon.muiName = 'SvgIcon';

export default DeleteIcon;
