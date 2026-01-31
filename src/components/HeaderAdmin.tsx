import React from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { usePreferences } from '../contexts/PreferencesContext';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';
import { Button } from '@mui/material';

interface HeaderAdminProps {
  onMenuClick: () => void;
}

/**
 * Application header.  Includes a drawer toggle button on the left, the
 * current page title in the centre, and controls on the right for theme
 * toggling and language selection.  The language menu is intentionally
 * simple, offering a choice between English and Arabic.
 */
const HeaderAdmin: React.FC<HeaderAdminProps> = ({ onMenuClick }) => {
  const { mode, toggleMode, language, setLanguage } = usePreferences();
  const { t } = useTranslation();
  const { logout } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleLangMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLangMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageChange = (lng: 'en' | 'ar') => {
    setLanguage(lng);
    handleLangMenuClose();
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <AppBar position="sticky" color="default" elevation={8} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={onMenuClick}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {t('Admin Panel')}
        </Typography>
        <IconButton color="inherit" onClick={toggleMode} sx={{ mr: 1 }}>
          {mode === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
        </IconButton>
        <IconButton color="inherit" onClick={handleLangMenuOpen}>
          <Typography variant="caption">{language.toUpperCase()}</Typography>
        </IconButton>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleLangMenuClose}>
          <MenuItem onClick={() => handleLanguageChange('en')}>EN</MenuItem>
          <MenuItem onClick={() => handleLanguageChange('ar')}>AR</MenuItem>
        </Menu>

        {/* Logout button */}
        <Button color="inherit" onClick={handleLogout} sx={{ ml: 1 }}>
          {t('Logout')}
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default HeaderAdmin;