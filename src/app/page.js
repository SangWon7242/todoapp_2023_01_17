'use client';

import { ThemeProvider } from '@mui/material/styles';
import * as React from 'react';
import {
  Button,
  Box,
  AppBar,
  Toolbar,
  Snackbar,
  Alert as MuiAlert,
  Backdrop,
  CircularProgress,
} from '@mui/material';
import { FaBars } from 'react-icons/fa';
import theme from './theme';

export default function App() {
  const [open, setOpen] = React.useState(false);

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
      <Button onClick={() => setOpen(true)}>Show backdrop</Button>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
        onClick={() => setOpen(false)}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
}
