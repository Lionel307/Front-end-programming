import * as React from 'react';
import SvgIcon from '@mui/material/SvgIcon';

function TickIcon (props) {
  return (
    <SvgIcon {...props}>
      <path d="M 16.59 7.58 L 10 14.17 l -3.59 -3.58 L 5 12 l 5 5 l 8 -8 Z M 12 2 C 6.48 2 2 6.48 2 12 s 4.48 10 10 10 s 10 -4.48 10 -10 S 17.52 2 12 2 Z m 0 18 c -4.42 0 -8 -3.58 -8 -8 s 3.58 -8 8 -8 s 8 3.58 8 8 s -3.58 8 -8 8 Z" />
    </SvgIcon>
  );
}

TickIcon.muiName = 'SvgIcon';

export default TickIcon;
