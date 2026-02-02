import React, { useState, useEffect, useContext, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Alert,
  Snackbar,
  CircularProgress,
  Box,
  Chip,
  Stack,
  Typography,
  InputAdornment,
  TableSortLabel,
  Card,
  CardContent,
  Divider,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { 
  IconPlus,
  IconSearch,
  IconX,
  IconUser,
  IconMail,
  IconPhone,
  IconLock,
} from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { AuthContext } from 'src/context/AuthContext';
import { getAllUsersByAgentId, registerUser } from 'src/utils/api';
import PageContainer from 'src/components/container/PageContainer';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import DashboardCard from 'src/components/shared/DashboardCard';
import { useNavigate } from 'react-router';

interface User {
  id: string;
  userName: string;
  email: string;
  phoneNumber: string;
  agentId: string;
  branchId: string | null;
  emailConfirmed: boolean;
  phoneNumberConfirmed: boolean;
  lockoutEnabled: boolean;
  accessFailedCount: number;
}

type OrderDirection = 'asc' | 'desc';
type SortableField = keyof Pick<User, 'userName' | 'email' | 'phoneNumber'>;

const Users: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  
  // Search & Sort States
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [orderBy, setOrderBy] = useState<SortableField>('userName');
  const [order, setOrder] = useState<OrderDirection>('asc');
  
  // Dialog States
  const [openDialog, setOpenDialog] = useState(false);
  
  const [formData, setFormData] = useState<Record<string, string>>({
    UserName: '',
    Password: '',
    PhoneNo: '',
    Email: '',
    AgentId: 'Agent1',
  });

  useEffect(() => {
    if (!token) {
      navigate('/auth/login');
    }
  }, [token, navigate]);

  const fetchUsers = async () => {
    if (!token) return;
    setLoading(true);
    setError('');
    try {
      const data = await getAllUsersByAgentId(token);
      setUsers(data);
    } catch (err: any) {
      console.error('Error fetching users:', err);
      setError(err.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [token]);

  const handleSort = (field: SortableField) => {
    const isAsc = orderBy === field && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(field);
  };

  const filteredAndSortedUsers = useMemo(() => {
    let filtered = [...users];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(user =>
        user.userName?.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query) ||
        user.phoneNumber?.toLowerCase().includes(query) ||
        user.agentId?.toLowerCase().includes(query)
      );
    }

    filtered.sort((a, b) => {
      const aValue = a[orderBy] || '';
      const bValue = b[orderBy] || '';
      
      if (order === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [users, searchQuery, orderBy, order]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOpenAddDialog = () => {
    setFormData({
      UserName: '',
      Password: '',
      PhoneNo: '',
      Email: '',
      AgentId: 'Agent1',
    });
    setOpenDialog(true);
  };

  const handleSubmit = async () => {
    if (!token) return;
    setError('');
    setSuccess('');
    
    try {
      await registerUser(formData, token);
      setSuccess(t('User registered successfully'));
      await fetchUsers();
      setOpenDialog(false);
      setFormData({
        UserName: '',
        Password: '',
        PhoneNo: '',
        Email: '',
        AgentId: 'Agent1',
      });
    } catch (err: any) {
      console.error('Error registering user:', err);
      setError(err.message || 'Failed to register user');
    }
  };

  const breadcrumbItems = [
    { to: '/', title: t('Home') },
    { title: t('Users') },
  ];

  return (
    <PageContainer title={t('Users')} description={t('Users') + ' Management'}>
      <Breadcrumb title={t('Users')} items={breadcrumbItems} />
      
      <DashboardCard
        title={t('Users Management')}
        action={
          <Button 
            variant="contained" 
            startIcon={<IconPlus />}
            onClick={handleOpenAddDialog}
            size={isMobile ? 'small' : 'medium'}
          >
            {isMobile ? t('Add') : t('Add User')}
          </Button>
        }
      >
        {/* Search Box */}
        <Box mb={3}>
          <TextField
            fullWidth
            placeholder={t('Search by username, email, phone...')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size={isMobile ? 'small' : 'medium'}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconSearch size={20} />
                </InputAdornment>
              ),
              endAdornment: searchQuery && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setSearchQuery('')}>
                    <IconX size={18} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          {searchQuery && (
            <Typography variant="body2" color="textSecondary" mt={1}>
              {t('Found')} {filteredAndSortedUsers.length} {t('results')}
            </Typography>
          )}
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : filteredAndSortedUsers.length === 0 ? (
          <Box textAlign="center" p={3}>
            <Typography variant="h6" color="textSecondary">
              {searchQuery ? t('No users found matching your search') : t('No users found')}
            </Typography>
          </Box>
        ) : isMobile ? (
          // ==================== MOBILE CARD VIEW ====================
          <Stack spacing={2}>
            {filteredAndSortedUsers.map((user) => (
              <Card key={user.id} variant="outlined">
                <CardContent>
                  <Stack spacing={2}>
                    {/* Header with Avatar */}
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: 'primary.light',
                          color: 'primary.main',
                        }}
                      >
                        <IconUser size={24} />
                      </Box>
                      <Box flex={1}>
                        <Typography variant="h6" fontWeight="bold">
                          {user.userName}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {user.agentId}
                        </Typography>
                      </Box>
                    </Stack>

                    <Divider />

                    {/* Details */}
                    <Stack spacing={1.5}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <IconMail size={16} color="gray" />
                        <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                          {user.email}
                        </Typography>
                      </Stack>

                      <Stack direction="row" alignItems="center" spacing={1}>
                        <IconPhone size={16} color="gray" />
                        <Typography variant="body2">
                          {user.phoneNumber}
                        </Typography>
                      </Stack>

                      {/* Status Chips */}
                      <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 1 }}>
                        <Chip 
                          label={user.emailConfirmed ? '✓ Email' : '✗ Email'} 
                          color={user.emailConfirmed ? 'success' : 'warning'}
                          size="small"
                        />
                        <Chip 
                          label={user.phoneNumberConfirmed ? '✓ Phone' : '✗ Phone'} 
                          color={user.phoneNumberConfirmed ? 'success' : 'warning'}
                          size="small"
                        />
                        <Chip 
                          label={user.lockoutEnabled ? t('Active') : t('Locked')} 
                          color={user.lockoutEnabled ? 'success' : 'error'}
                          size="small"
                        />
                      </Stack>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Stack>
        ) : (
          // ==================== DESKTOP TABLE VIEW ====================
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'userName'}
                      direction={orderBy === 'userName' ? order : 'asc'}
                      onClick={() => handleSort('userName')}
                    >
                      <strong>{t('Username')}</strong>
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'email'}
                      direction={orderBy === 'email' ? order : 'asc'}
                      onClick={() => handleSort('email')}
                    >
                      <strong>{t('Email')}</strong>
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'phoneNumber'}
                      direction={orderBy === 'phoneNumber' ? order : 'asc'}
                      onClick={() => handleSort('phoneNumber')}
                    >
                      <strong>{t('Phone Number')}</strong>
                    </TableSortLabel>
                  </TableCell>
                  <TableCell><strong>{t('Agent ID')}</strong></TableCell>
                  <TableCell><strong>{t('Email Verified')}</strong></TableCell>
                  <TableCell><strong>{t('Phone Verified')}</strong></TableCell>
                  <TableCell><strong>{t('Status')}</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredAndSortedUsers.map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <IconUser size={18} />
                        <Typography variant="body2">{user.userName}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <IconMail size={18} />
                        <Typography variant="body2">{user.email}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <IconPhone size={18} />
                        <Typography variant="body2">{user.phoneNumber}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>{user.agentId}</TableCell>
                    <TableCell>
                      <Chip 
                        label={user.emailConfirmed ? t('Verified') : t('Not Verified')} 
                        color={user.emailConfirmed ? 'success' : 'warning'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={user.phoneNumberConfirmed ? t('Verified') : t('Not Verified')} 
                        color={user.phoneNumberConfirmed ? 'success' : 'warning'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={user.lockoutEnabled ? t('Active') : t('Locked')} 
                        color={user.lockoutEnabled ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DashboardCard>

      {/* Add User Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle>
          <Stack direction="row" alignItems="center" spacing={1}>
            <IconUser />
            <Typography variant="h6">{t('Add New User')}</Typography>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Stack spacing={2}>
              <TextField
                label={t('Username')}
                name="UserName"
                fullWidth
                required
                value={formData.UserName}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconUser size={20} />
                    </InputAdornment>
                  ),
                }}
              />
              
              <TextField
                label={t('Password')}
                name="Password"
                type="password"
                fullWidth
                required
                value={formData.Password}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconLock size={20} />
                    </InputAdornment>
                  ),
                }}
                helperText={t('Password must be at least 6 characters')}
              />

              <TextField
                label={t('Phone Number')}
                name="PhoneNo"
                fullWidth
                required
                value={formData.PhoneNo}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconPhone size={20} />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                label={t('Email')}
                name="Email"
                type="email"
                fullWidth
                required
                value={formData.Email}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconMail size={20} />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                label={t('Agent ID')}
                name="AgentId"
                fullWidth
                required
                value={formData.AgentId}
                onChange={handleChange}
              />
            </Stack>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>{t('Cancel')}</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            disabled={
              !formData.UserName || 
              !formData.Password || 
              !formData.PhoneNo || 
              !formData.Email ||
              !formData.AgentId
            }
          >
            {t('Register')}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={!!success} autoHideDuration={3000} onClose={() => setSuccess('')}>
        <Alert severity="success" onClose={() => setSuccess('')}>
          {success}
        </Alert>
      </Snackbar>

      <Snackbar open={!!error} autoHideDuration={4000} onClose={() => setError('')}>
        <Alert severity="error" onClose={() => setError('')}>
          {error}
        </Alert>
      </Snackbar>
    </PageContainer>
  );
};

export default Users;
