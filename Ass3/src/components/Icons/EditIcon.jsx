import * as React from 'react';
import SvgIcon from '@mui/material/SvgIcon';

function EditIcon (props) {
  return (
    <SvgIcon {...props}>
      <path d="M 3 17.25 V 21 h 3.75 L 17.81 9.94 l -3.75 -3.75 L 3 17.25 Z M 20.71 7.04 c 0.39 -0.39 0.39 -1.02 0 -1.41 l -2.34 -2.34 a 0.9959 0.9959 0 0 0 -1.41 0 l -1.83 1.83 l 3.75 3.75 l 1.83 -1.83 Z" />
    </SvgIcon>
  );
}

EditIcon.muiName = 'SvgIcon';

export default EditIcon;
