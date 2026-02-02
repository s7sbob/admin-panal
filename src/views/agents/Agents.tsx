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
  IconEdit, 
  IconPlus,
  IconSearch,
  IconX,
  IconPhone,
  IconMail,
} from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { AuthContext } from 'src/context/AuthContext';
import { getAgents, addAgent, updateAgent } from 'src/utils/api';
import PageContainer from 'src/components/container/PageContainer';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import DashboardCard from 'src/components/shared/DashboardCard';
import { useNavigate } from 'react-router';

interface Agent {
  id: string;
  agentName: string;
  address: string | null;
  governorate: string | null;
  phoneNumber: string | null;
  whatsAppNumber: string | null;
  email: string | null;
  isActive: boolean;
}

type OrderDirection = 'asc' | 'desc';
type SortableField = keyof Pick<Agent, 'agentName' | 'governorate' | 'phoneNumber' | 'email'>;

const Agents: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  
  // Search & Sort States
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [orderBy, setOrderBy] = useState<SortableField>('agentName');
  const [order, setOrder] = useState<OrderDirection>('asc');
  
  // Dialog States
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  
  const [formData, setFormData] = useState<Record<string, string>>({
    Id: '',
    AgentName: '',
    Address: '',
    Governorate: '',
    PhoneNumber: '',
    WhatsAppNumber: '',
    Email: '',
  });

  useEffect(() => {
    if (!token) {
      navigate('/auth/login');
    }
  }, [token, navigate]);

  const fetchAgents = async () => {
    if (!token) return;
    setLoading(true);
    setError('');
    try {
      const data = await getAgents(token);
      setAgents(data);
    } catch (err: any) {
      console.error('Error fetching agents:', err);
      setError(err.message || 'Failed to load agents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, [token]);

  const handleSort = (field: SortableField) => {
    const isAsc = orderBy === field && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(field);
  };

  const filteredAndSortedAgents = useMemo(() => {
    let filtered = [...agents];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(agent =>
        agent.agentName?.toLowerCase().includes(query) ||
        agent.governorate?.toLowerCase().includes(query) ||
        agent.phoneNumber?.toLowerCase().includes(query) ||
        agent.email?.toLowerCase().includes(query) ||
        agent.address?.toLowerCase().includes(query)
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
  }, [agents, searchQuery, orderBy, order]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOpenAdd = () => {
    setEditMode(false);
    setFormData({
      Id: '',
      AgentName: '',
      Address: '',
      Governorate: '',
      PhoneNumber: '',
      WhatsAppNumber: '',
      Email: '',
    });
    setOpenDialog(true);
  };

  const handleOpenEdit = (agent: Agent) => {
    setEditMode(true);
    setFormData({
      Id: agent.id,
      AgentName: agent.agentName,
      Address: agent.address || '',
      Governorate: agent.governorate || '',
      PhoneNumber: agent.phoneNumber || '',
      WhatsAppNumber: agent.whatsAppNumber || '',
      Email: agent.email || '',
    });
    setOpenDialog(true);
  };

  const handleSubmit = async () => {
    if (!token) return;
    setError('');
    setSuccess('');
    
    try {
      if (editMode) {
        await updateAgent(formData, token);
        setSuccess(t('Agent updated successfully'));
      } else {
        await addAgent(formData, token);
        setSuccess(t('Agent added successfully'));
      }
      
      await fetchAgents();
      setOpenDialog(false);
    } catch (err: any) {
      console.error('Error saving agent:', err);
      setError(err.message || 'Failed to save agent');
    }
  };

  const breadcrumbItems = [
    { to: '/', title: t('Home') },
    { title: t('Agents') },
  ];

  return (
    <PageContainer title={t('Agents')} description={t('Agents') + ' Management'}>
      <Breadcrumb title={t('Agents')} items={breadcrumbItems} />
      
      <DashboardCard
        title={t('Agents Management')}
        action={
          <Button 
            variant="contained" 
            startIcon={<IconPlus />}
            onClick={handleOpenAdd}
            size={isMobile ? 'small' : 'medium'}
          >
            {isMobile ? t('Add') : t('Add Agent')}
          </Button>
        }
      >
        {/* Search Box */}
        <Box mb={3}>
          <TextField
            fullWidth
            placeholder={t('Search by name, governorate, phone, email...')}
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
              {t('Found')} {filteredAndSortedAgents.length} {t('results')}
            </Typography>
          )}
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : filteredAndSortedAgents.length === 0 ? (
          <Box textAlign="center" p={3}>
            <Typography variant="h6" color="textSecondary">
              {searchQuery ? t('No agents found matching your search') : t('No agents found')}
            </Typography>
          </Box>
        ) : isMobile ? (
          // ==================== MOBILE CARD VIEW ====================
          <Stack spacing={2}>
            {filteredAndSortedAgents.map((agent) => (
              <Card key={agent.id} variant="outlined">
                <CardContent>
                  <Stack spacing={2}>
                    {/* Header with Actions */}
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                      <Box flex={1}>
                        <Typography variant="h6" fontWeight="bold">
                          {agent.agentName}
                        </Typography>
                        {agent.governorate && (
                          <Typography variant="body2" color="textSecondary">
                            📍 {agent.governorate}
                          </Typography>
                        )}
                      </Box>
                      <IconButton 
                        color="primary" 
                        size="small"
                        onClick={() => handleOpenEdit(agent)}
                      >
                        <IconEdit size={18} />
                      </IconButton>
                    </Stack>

                    <Divider />

                    {/* Details */}
                    <Stack spacing={1.5}>
                      {agent.phoneNumber && (
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <IconPhone size={16} color="gray" />
                          <Typography variant="body2">
                            {agent.phoneNumber}
                          </Typography>
                        </Stack>
                      )}

                      {agent.whatsAppNumber && (
                        <Stack direction="row" spacing={1}>
                          <Typography variant="body2" color="textSecondary" sx={{ minWidth: 80 }}>
                            WhatsApp:
                          </Typography>
                          <Typography variant="body2">
                            {agent.whatsAppNumber}
                          </Typography>
                        </Stack>
                      )}

                      {agent.email && (
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <IconMail size={16} color="gray" />
                          <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                            {agent.email}
                          </Typography>
                        </Stack>
                      )}

                      {agent.address && (
                        <Typography variant="body2" color="textSecondary">
                          {agent.address}
                        </Typography>
                      )}

                      <Stack direction="row" spacing={1} alignItems="center">
                        <Chip 
                          label={agent.isActive ? t('Active') : t('Inactive')} 
                          color={agent.isActive ? 'success' : 'default'}
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
                      active={orderBy === 'agentName'}
                      direction={orderBy === 'agentName' ? order : 'asc'}
                      onClick={() => handleSort('agentName')}
                    >
                      <strong>{t('Name')}</strong>
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'governorate'}
                      direction={orderBy === 'governorate' ? order : 'asc'}
                      onClick={() => handleSort('governorate')}
                    >
                      <strong>{t('Governorate')}</strong>
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
                  <TableCell><strong>{t('WhatsApp')}</strong></TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'email'}
                      direction={orderBy === 'email' ? order : 'asc'}
                      onClick={() => handleSort('email')}
                    >
                      <strong>{t('Email')}</strong>
                    </TableSortLabel>
                  </TableCell>
                  <TableCell><strong>{t('Status')}</strong></TableCell>
                  <TableCell align="center"><strong>{t('Actions')}</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredAndSortedAgents.map((agent) => (
                  <TableRow key={agent.id} hover>
                    <TableCell>{agent.agentName}</TableCell>
                    <TableCell>{agent.governorate || '-'}</TableCell>
                    <TableCell>{agent.phoneNumber || '-'}</TableCell>
                    <TableCell>{agent.whatsAppNumber || '-'}</TableCell>
                    <TableCell>{agent.email || '-'}</TableCell>
                    <TableCell>
                      <Chip 
                        label={agent.isActive ? t('Active') : t('Inactive')} 
                        color={agent.isActive ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton 
                        color="primary" 
                        size="small"
                        onClick={() => handleOpenEdit(agent)}
                        title={t('Edit Agent')}
                      >
                        <IconEdit size={18} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DashboardCard>

      {/* Add/Edit Agent Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle>
          {editMode ? t('Edit Agent') : t('Add Agent')}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Stack spacing={2}>
              <TextField
                label={t('Agent Name')}
                name="AgentName"
                fullWidth
                required
                value={formData.AgentName}
                onChange={handleChange}
              />
              
              <TextField
                label={t('Governorate')}
                name="Governorate"
                fullWidth
                value={formData.Governorate}
                onChange={handleChange}
              />

              <TextField
                label={t('Address')}
                name="Address"
                fullWidth
                value={formData.Address}
                onChange={handleChange}
              />

              <TextField
                label={t('Phone Number')}
                name="PhoneNumber"
                fullWidth
                value={formData.PhoneNumber}
                onChange={handleChange}
              />

              <TextField
                label={t('WhatsApp Number')}
                name="WhatsAppNumber"
                fullWidth
                value={formData.WhatsAppNumber}
                onChange={handleChange}
              />

              <TextField
                label={t('Email')}
                name="Email"
                type="email"
                fullWidth
                value={formData.Email}
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
            disabled={!formData.AgentName}
          >
            {editMode ? t('Update') : t('Add')}
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

export default Agents;
