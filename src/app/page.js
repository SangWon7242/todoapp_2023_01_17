'use client';

import { ThemeProvider } from '@mui/material/styles';
import { Button, Box, AppBar, Toolbar } from '@mui/material';
import { MdDelete } from 'react-icons/md';
import theme from './theme';

export default function App() {
  return (
    <>
      <ThemeProvider theme={theme}>
        <AppBar position="static">
          <Toolbar className="tw-justify-center">
            <a className="tw-font-bold" href="/">
              HAPPY NOTE
            </a>
          </Toolbar>
        </AppBar>
      </ThemeProvider>
    </>
  );
}
