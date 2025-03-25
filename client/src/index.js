import React from 'react';
import { createRoot } from 'react-dom/client'; // Updated import
import App from './App';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';

const container = document.getElementById('root');
const root = createRoot(container); // Create a root
root.render(
  <ThemeProvider theme={theme}>
    <App />
  </ThemeProvider>
);