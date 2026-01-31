import React, { useState, useEffect, useContext } from 'react';
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
} from '@mui/material';
import { IconEdit, IconPlus } from '@tabler/icons-react';
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
  notes: string | null;
  creationDate: string;
  isActive: boolean;
  tenantId: string | null;
  branchId: string | null;
}

const Agents: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>({
    Id: '',
    AgentName: '',
    CreationDate: new Date().toISOString().split('T')[0],
    Address: '',
    PhoneNumber: '',
    WhatsAppNumber: '',
    Email: '',
    Governorate: '',
    Notes: '',
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOpenAdd = () => {
    setEditMode(false);
    setFormData({
      Id: '',
      AgentName: '',
      CreationDate: new Date().toISOString().split('T')[0],
      Address: '',
      PhoneNumber: '',
      WhatsAppNumber: '',
      Email: '',
      Governorate: '',
      Notes: '',
    });
    setOpenDialog(true);
  };

  const handleOpenEdit = (agent: Agent) => {
    setEditMode(true);
    setFormData({
      Id: agent.id,
      AgentName: agent.agentName,
      CreationDate: agent.creationDate ? agent.creationDate.split('T')[0] : new Date().toISOString().split('T')[0],
      Address: agent.address || '',
      PhoneNumber: agent.phoneNumber || '',
      WhatsAppNumber: agent.whatsAppNumber || '',
      Email: agent.email || '',
      Governorate: agent.governorate || '',
      Notes: agent.notes || '',
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
        title={t('Agents')}
        action={
          <Button 
            variant="contained" 
            startIcon={<IconPlus />}
            onClick={handleOpenAdd}
          >
            {t('Add Agent')}
          </Button>
        }
      >
        {loading ? (
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : agents.length === 0 ? (
          <Box textAlign="center" p={3}>
            <Typography variant="h6" color="textSecondary">
              {t('No agents found')}
            </Typography>
          </Box>
        ) : (
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>{t('Name')}</strong></TableCell>
                  <TableCell><strong>{t('Phone Number')}</strong></TableCell>
                  <TableCell><strong>{t('WhatsApp Number')}</strong></TableCell>
                  <TableCell><strong>{t('Email')}</strong></TableCell>
                  <TableCell><strong>{t('Governorate')}</strong></TableCell>
                  <TableCell><strong>{t('Status')}</strong></TableCell>
                  <TableCell align="center"><strong>{t('Actions')}</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {agents.map((agent) => (
                  <TableRow key={agent.id} hover>
                    <TableCell>{agent.agentName}</TableCell>
                    <TableCell>{agent.phoneNumber || '-'}</TableCell>
                    <TableCell>{agent.whatsAppNumber || '-'}</TableCell>
                    <TableCell>{agent.email || '-'}</TableCell>
                    <TableCell>{agent.governorate || '-'}</TableCell>
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

      {/* Agent Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="md">
        <DialogTitle>
          {editMode ? t('Edit Agent') : t('Add Agent')}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Stack spacing={2}>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <TextField
                  label={t('Agent Name')}
                  name="AgentName"
                  fullWidth
                  required
                  value={formData.AgentName}
                  onChange={handleChange}
                />
                <TextField
                  label={t('Creation Date')}
                  name="CreationDate"
                  type="date"
                  fullWidth
                  value={formData.CreationDate}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Stack>

              <TextField
                label={t('Address')}
                name="Address"
                fullWidth
                value={formData.Address}
                onChange={handleChange}
              />

              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <TextField
                  label={t('Governorate')}
                  name="Governorate"
                  fullWidth
                  value={formData.Governorate}
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

              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
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
              </Stack>

              <TextField
                label={t('Notes')}
                name="Notes"
                fullWidth
                multiline
                rows={3}
                value={formData.Notes}
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
