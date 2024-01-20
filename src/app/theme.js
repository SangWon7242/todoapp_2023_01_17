import {
  createTheme
} from '@mui/material/styles';
import * as React from 'react';

const muiThemePaletteKeys = [
  "background",
  "common",
  "error",
  "grey",
  "info",
  "primary",
  "secondary",
  "success",
  "text",
  "warning",
];

export default function RootTheme() {
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

  React.useEffect(() => {
    const r = document.querySelector(":root");

    muiThemePaletteKeys.forEach((paletteKey) => {
      const themeColorObj = theme.palette[paletteKey];

      for (const key in themeColorObj) {
        if (Object.hasOwnProperty.call(themeColorObj, key)) {
          const colorVal = themeColorObj[key];
          r.style.setProperty(`--mui-color-${paletteKey}-${key}`, colorVal);
        }
      }
    });
  }, []);

  return theme;
}