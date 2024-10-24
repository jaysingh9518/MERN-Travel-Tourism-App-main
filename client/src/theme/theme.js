// src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#ff681a', // Customize your primary color
    },
    secondary: {
      main: '#37d4d9', // Customize your secondary color
    },
    background: {
      default: '#f5f5f5', // Customize your background color
      paper: '#ffffff', // Paper color
    },
    text: {
      primary: '#333333', // Primary text color
      secondary: '#666666', // Secondary text color
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      lineHeight: 1.5,
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
      lineHeight: 1.4,
    },
    h5: {
      fontWeight: 500,
      fontSize: '1.5rem',
      lineHeight: 1.3,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
  },
});

export default theme;
