import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    typography: {
      fontFamily: ['GmarketSansMedium'],
    },
    primary: {
      main: '#48d1cc',
      contrastText: '#fff',
    },
    secondary: {
      main: '#afafaf',
    },
  },
});

export default theme;
