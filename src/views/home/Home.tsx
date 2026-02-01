import React, { useContext } from 'react';
import { useNavigate } from 'react-router';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Button,
  Stack,
  alpha,
  useTheme,
} from '@mui/material';
import { 
  IconBuildingStore, 
  IconUserCircle,
  IconSettings,
  IconChartBar,
} from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { AuthContext } from 'src/context/AuthContext';
import PageContainer from 'src/components/container/PageContainer';

const Home: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { token, logout } = useContext(AuthContext);
  const theme = useTheme();

  React.useEffect(() => {
    if (!token) {
      navigate('/auth/login');
    }
  }, [token, navigate]);

  const menuItems = [
    {
      title: t('Tenants'),
      description: t('Manage tenants and their branches'),
      icon: IconBuildingStore,
      color: theme.palette.primary.main,
      path: '/tenants',
    },
    {
      title: t('Agents'),
      description: t('Manage system agents'),
      icon: IconUserCircle,
      color: theme.palette.secondary.main,
      path: '/agents',
    },
  ];

  const stats = [
    { label: t('Total Tenants'), value: '6', icon: IconBuildingStore, color: theme.palette.primary.main },
    { label: t('Total Agents'), value: '1', icon: IconUserCircle, color: theme.palette.secondary.main },
    { label: t('Total Branches'), value: '1', icon: IconBuildingStore, color: theme.palette.success.main },
    { label: t('System Health'), value: '100%', icon: IconChartBar, color: theme.palette.info.main },
  ];

  return (
    <PageContainer title={t('Home')} description="Admin Panel Home">
      <Box>
        {/* Header */}
        <Box 
          sx={{ 
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            borderRadius: 2,
            p: 4,
            mb: 4,
            color: 'white',
          }}
        >
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            {t('Welcome to Admin Panel')} 👋
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            {t('Manage your system from one place')}
          </Typography>
        </Box>

        {/* Quick Stats */}
        <Box 
          sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' },
            gap: 3,
            mb: 4,
          }}
        >
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card 
                key={index}
                sx={{ 
                  background: alpha(stat.color, 0.1),
                  border: `1px solid ${alpha(stat.color, 0.2)}`,
                }}
              >
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: stat.color,
                        color: 'white',
                      }}
                    >
                      <IconComponent size={24} />
                    </Box>
                    <Box>
                      <Typography variant="h4" fontWeight="bold">
                        {stat.value}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {stat.label}
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            );
          })}
        </Box>

        {/* Quick Actions */}
        <Typography variant="h5" fontWeight="bold" mb={3}>
          {t('Quick Actions')}
        </Typography>
        <Box 
          sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' },
            gap: 3,
          }}
        >
          {menuItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <Card 
                key={index}
                sx={{ 
                  height: '100%',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: theme.shadows[8],
                  }
                }}
                onClick={() => navigate(item.path)}
              >
                <CardContent>
                  <Stack spacing={2} alignItems="center" textAlign="center">
                    <Box
                      sx={{
                        width: 64,
                        height: 64,
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: alpha(item.color, 0.1),
                        color: item.color,
                      }}
                    >
                      <IconComponent size={32} />
                    </Box>
                    <Box>
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        {item.title}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {item.description}
                      </Typography>
                    </Box>
                    <Button 
                      variant="outlined" 
                      fullWidth
                      sx={{ 
                        borderColor: item.color,
                        color: item.color,
                        '&:hover': {
                          borderColor: item.color,
                          background: alpha(item.color, 0.1),
                        }
                      }}
                    >
                      {t('Go to')} {item.title}
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            );
          })}
        </Box>

        {/* Logout Button */}
        <Box mt={4} textAlign="center">
          <Button 
            variant="outlined" 
            color="error"
            onClick={() => {
              logout();
              navigate('/auth/login');
            }}
          >
            {t('Logout')}
          </Button>
        </Box>
      </Box>
    </PageContainer>
  );
};

export default Home;
