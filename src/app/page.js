'use client';

import { ThemeProvider } from '@mui/material/styles';
import { Button, Box, AppBar, Toolbar } from '@mui/material';
import theme from './theme';

export default function App() {
  return (
    <>
      <ThemeProvider theme={theme}>
        <Button variant="contained">버튼</Button>
      </ThemeProvider>
    </>
  );
}
