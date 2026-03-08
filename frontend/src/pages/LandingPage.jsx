import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Box, Button, Container } from '@mui/material';
import { Login, PersonAdd } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import AppLogo from '../components/AppLogo';

export default function LandingPage() {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate('/home', { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) return null;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: { xs: 2, sm: 3, md: 4 },
        bgcolor: 'background.default',
      }}
    >
      <Container maxWidth="lg" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
        <AppLogo
          variant="full"
          showTagline
          size="large"
          sx={{ mb: 3, flexDirection: 'column', alignItems: 'center', gap: 2, textAlign: 'center' }}
        />

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Button
            component={Link}
            to="/login"
            variant="contained"
            size="large"
            startIcon={<Login />}
          >
            Sign in
          </Button>
          <Button
            component={Link}
            to="/register"
            variant="outlined"
            size="large"
            startIcon={<PersonAdd />}
          >
            Sign up
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
