import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1f2937' },
    secondary: { main: '#0ea5e9' },
    background: { default: '#f8fafc' },
  },
  shape: { borderRadius: 10 },
  typography: {
    fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
});