'use client';

import { ThemeProvider } from '@mui/material/styles';
import { Button, Box, AppBar, Toolbar } from '@mui/material';
import { MdDelete } from 'react-icons/md';
import theme from './theme';

export default function App() {
  return (
    <>
      <ThemeProvider theme={theme}>
        <div className="tw-flex tw-items-center tw-gap-x-3">
          <Button variant="text">Text</Button>
          <Button variant="contained">Contained</Button>
          <Button variant="outlined">Outlined</Button>
        </div>

        <div className="tw-flex tw-items-center tw-gap-x-3 tw-mt-3">
          <Button variant="text" onClick={() => alert('버튼이 클릭되었습니다.')}>
            Text
          </Button>
          <Button variant="contained" disabled>
            Contained
          </Button>
          <Button variant="outlined" href="/sub">
            Sub 이동
          </Button>
          <Button variant="contained" endIcon={<MdDelete />}>
            삭제
          </Button>
        </div>
      </ThemeProvider>
    </>
  );
}
