'use client';

import { ThemeProvider } from '@mui/material/styles';
import * as React from 'react';
import { Button, Box, AppBar, Toolbar, Snackbar, Alert as MuiAlert } from '@mui/material';
import { FaBars } from 'react-icons/fa';
import theme from './theme';

const Alert = React.forwardRef((props, ref) => {
  return <MuiAlert {...props} ref={ref} variant="filled" />;
});

export default function App() {
  const [open, setOpen] = React.useState(false);

  const alertRef = React.useRef(null);
  // ref는 컴포넌트에 전달되지 않는다.

  return (
    <>
      <ThemeProvider theme={theme}>
        <AppBar position="fixed">
          <Toolbar>
            <div className="tw-flex-1">
              <FaBars className="tw-cursor-pointer" />
            </div>
            <div className="logo-box">
              <a className="tw-font-bold" href="/">
                HAPPY NOTE
              </a>
            </div>
            <div className="tw-flex-1 tw-flex tw-justify-end">
              <a href="/write">글작성</a>
            </div>
          </Toolbar>
        </AppBar>
        <Toolbar />
      </ThemeProvider>
      <section>
        <Button onClick={() => setOpen(true)} variant="contained">
          게시물 삭제
        </Button>
        <Snackbar open={open} autoHideDuration={6000} onClose={() => setOpen(false)}>
          {/* <Alert ref={alertRef} severity="success">
            게시물이 삭제되었습니다.
          </Alert> */}
          <Alert ref={alertRef} severity="warning">
            게시물이 삭제되었습니다.
          </Alert>
        </Snackbar>
      </section>
    </>
  );
}
