import { AppBar, Toolbar, Typography, Container, Box } from '@mui/material';
import { Outlet, Link as RouterLink } from 'react-router-dom';

export default function AppLayout() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="static" elevation={0} color="primary">
        <Toolbar>
          <Typography
            variant="h6"
            component={RouterLink}
            to="/users"
            sx={{ color: 'inherit', textDecoration: 'none', flexGrow: 1 }}
          >
            User Profiles
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Outlet />
      </Container>
    </Box>
  );
}