import React from 'react';
import { 
  Box, 
  Stack, 
  Button, 
  Typography, 
  FormGroup, 
  FormControlLabel,
  CircularProgress,
  InputAdornment,
  IconButton
} from '@mui/material';
import { IconEye, IconEyeOff, IconPhone, IconLock } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import CustomCheckbox from 'src/components/forms/theme-elements/CustomCheckbox';
import CustomTextField from 'src/components/forms/theme-elements/CustomTextField';
import CustomFormLabel from 'src/components/forms/theme-elements/CustomFormLabel';

interface Props {
  onSubmit: (phone: string, password: string) => void;
  isLoading?: boolean;
}

const AuthLogin: React.FC<Props> = ({ onSubmit, isLoading = false }) => {
  const { t } = useTranslation();
  const [phone, setPhone] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [rememberMe, setRememberMe] = React.useState(false);

  React.useEffect(() => {
    const savedPhone = localStorage.getItem('admin_remembered_phone');
    const savedRemember = localStorage.getItem('admin_remember_me') === 'true';
    
    if (savedRemember && savedPhone) {
      setPhone(savedPhone);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rememberMe) {
      localStorage.setItem('admin_remembered_phone', phone);
      localStorage.setItem('admin_remember_me', 'true');
    } else {
      localStorage.removeItem('admin_remembered_phone');
      localStorage.removeItem('admin_remember_me');
    }
    
    onSubmit(phone, password);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={2}>
        <Box>
          <CustomFormLabel htmlFor="phone">{t('Phone Number')}</CustomFormLabel>
          <CustomTextField 
            id="phone" 
            fullWidth 
            value={phone} 
            onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setPhone(e.target.value)}
            placeholder={t('Enter your phone number')}
            disabled={isLoading}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconPhone size={20} />
                </InputAdornment>
              )
            }}
          />
        </Box>
        
        <Box>
          <CustomFormLabel htmlFor="password">{t('Password')}</CustomFormLabel>
          <CustomTextField 
            id="password" 
            type={showPassword ? 'text' : 'password'}
            fullWidth 
            value={password} 
            onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setPassword(e.target.value)}
            placeholder={t('Enter your password')}
            disabled={isLoading}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconLock size={20} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={togglePasswordVisibility}
                    edge="end"
                    disabled={isLoading}
                  >
                    {showPassword ? <IconEyeOff size={20} /> : <IconEye size={20} />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        </Box>

        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <FormGroup>
            <FormControlLabel 
              control={
                <CustomCheckbox 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={isLoading}
                />
              } 
              label={t('Remember Me')}
            />
          </FormGroup>
        </Stack>

        <Button 
          variant="contained" 
          type="submit" 
          fullWidth
          disabled={isLoading || !phone.trim() || !password.trim()}
          sx={{ 
            py: 1.5,
            fontSize: '1rem'
          }}
        >
          {isLoading ? (
            <Stack direction="row" alignItems="center" spacing={1}>
              <CircularProgress size={20} color="inherit" />
              <Typography>{t('Signing In...')}</Typography>
            </Stack>
          ) : (
            t('Login')
          )}
        </Button>
      </Stack>
    </form>
  );
};

export default AuthLogin;
