import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import PersonIcon from '@mui/icons-material/Person';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface SidebarAdminProps {
  open: boolean;
  onClose: () => void;
}

/**
 * Primary navigation drawer for the admin panel.  Presents links to the
 * Tenants, Branches and Agents sections.  The drawer closes automatically
 * when a link is selected to improve usability on mobile devices.
 */
const SidebarAdmin: React.FC<SidebarAdminProps> = ({ open, onClose }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const menuItems = [
    {
      to: '/tenants',
      icon: <PeopleIcon />,
      label: t('Tenants'),
    },
    {
      to: '/agents',
      icon: <PersonIcon />,
      label: t('Agents'),
    },
  ];
  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      variant="temporary"
      sx={{
        '& .MuiDrawer-paper': {
          width: 240,
        },
      }}
    >
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.to} disablePadding>
            <ListItemButton
              component={Link}
              to={item.to}
              onClick={onClose}
              selected={location.pathname === item.to}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default SidebarAdmin;