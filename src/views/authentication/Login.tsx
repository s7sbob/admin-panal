import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Card, Typography, Snackbar, Alert, Container } from '@mui/material';
import { useTranslation } from 'react-i18next';
import PageContainer from 'src/components/container/PageContainer';
import Logo from 'src/layouts/full/shared/logo/Logo';
import AuthLogin from './components/AuthLogin';
import { login } from 'src/utils/api';
import { AuthContext } from 'src/context/AuthContext';

/**
 * Login component for Admin Panel
 * 
 * Simple admin authentication without tenant/company/branch complexity.
 * API returns {token, expiration} on success or false on failure.
 */
const Login: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setAuthData } = useContext(AuthContext);
  const [msg, setMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

const handleLogin = async (phone: string, password: string) => {
  setIsLoading(true);
  setMsg('');
  
  try {
    console.log('🚀 Starting login...', { phone });
    const result = await login(phone, password);
    console.log('🚀 Login result:', result);
    
    if (result === false) {
      console.log('❌ Unauthorized');
      setMsg(t('Login Failed - Unauthorized'));
      return;
    }
    
    if (result && result.token) {
      console.log('✅ Login successful');
      
      setAuthData(result.token); // ⭐ بس الـ token
      
      if (result.expiration) {
        localStorage.setItem('token_expiration', result.expiration);
        console.log('✅ Expiration saved:', result.expiration);
      }
      
      console.log('➡️ Navigating to Home');
      navigate('/', { replace: true });
    } else {
      console.error('❌ Invalid response structure:', result);
      setMsg(t('Login Failed - Invalid Response'));
    }
  } catch (err: any) {
    console.error('❌ Login failed:', err);
    setMsg(err?.message || t('Login Failed'));
  } finally {
    setIsLoading(false);
  }
};


  return (
    <PageContainer title={t('Login to Admin Panel')} description="Admin Panel Login">
      <Box sx={{ 
        position: 'relative', 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        '&:before': {
          content: '""',
          background: 'radial-gradient(#d2f1df, #d3d7fa, #bad8f4)',
          backgroundSize: '400% 400%',
          animation: 'gradient 15s ease infinite',
          position: 'absolute', 
          inset: 0, 
          opacity: 0.3 
        }
      }}>
        <Container maxWidth="sm" sx={{ zIndex: 1 }}>
          <Card elevation={9} sx={{ p: 4, width: '100%' }}>
            <Box textAlign="center" mb={3}>
              <Logo />
            </Box>

            <Typography variant="h4" mb={3} textAlign="center">
              {t('Login to Admin Panel')}
            </Typography>

            <AuthLogin
              onSubmit={handleLogin}
              isLoading={isLoading}
            />
          </Card>
        </Container>
      </Box>

      <Snackbar open={!!msg} autoHideDuration={4000} onClose={() => setMsg('')}>
        <Alert severity="error" onClose={() => setMsg('')}>
          {msg}
        </Alert>
      </Snackbar>
    </PageContainer>
  );
};

export default Login;
