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
  Drawer,
  List,
  ListItemButton,
  Tabs,
  Tab,
} from '@mui/material';
import Link from 'next/link';
import { FaBars } from 'react-icons/fa';
import theme from './theme';

export default function App() {
  const [tab1CurrentIndex, setTab1CurrentIndex] = React.useState(0);

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
      <Tabs value={tab1CurrentIndex} onChange={(_, newValue) => setTab1CurrentIndex(newValue)}>
        <Tab label="Item One" />
        <Tab label="Item Two" />
        <Tab label="Item Three" />
      </Tabs>
      {tab1CurrentIndex == 0 && <div>내용1</div>}
      {tab1CurrentIndex == 1 && <div>내용2</div>}
      {tab1CurrentIndex == 2 && <div>내용3</div>}
    </>
  );
}
