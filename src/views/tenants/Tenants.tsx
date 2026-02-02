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
  Collapse,
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
  IconChevronDown, 
  IconChevronRight,
  IconBuildingStore,
  IconSearch,
  IconX,
  IconTrash,
} from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { AuthContext } from 'src/context/AuthContext';
import { 
  getTenants, 
  addTenant, 
  updateTenant, 
  deleteTenant,
  getBranches, 
  addBranch, 
  updateBranch 
} from 'src/utils/api';
import PageContainer from 'src/components/container/PageContainer';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import DashboardCard from 'src/components/shared/DashboardCard';
import { useNavigate } from 'react-router';

interface Tenant {
  id: string;
  tenantName: string;
  tenantCode: string;
  dbName: string;
  facilityName: string | null;
  address: string | null;
  governorate: string | null;
  phoneNumber: string | null;
  whatsAppNumber: string | null;
  email: string | null;
  responsibleName: string | null;
  activity: string | null;
  creationDate: string | null;
  isActive: boolean;
}

interface Branch {
  id: string;
  branchId: string | null;
  name: string;
  address: string | null;
  governate: string | null;
  phone: string | null;
  expireDate: string;
  tenantId: string | null;
  isActive: boolean;
}

type OrderDirection = 'asc' | 'desc';
type SortableField = keyof Pick<Tenant, 'tenantName' | 'tenantCode' | 'dbName' | 'phoneNumber' | 'email'>;

const Tenants: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingBranches, setLoadingBranches] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  
  // Search & Sort States
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [orderBy, setOrderBy] = useState<SortableField>('tenantName');
  const [order, setOrder] = useState<OrderDirection>('asc');
  
  // Tenant Dialog States
  const [openTenantDialog, setOpenTenantDialog] = useState(false);
  const [editTenantMode, setEditTenantMode] = useState(false);
  
  // Branch Dialog States
  const [openBranchDialog, setOpenBranchDialog] = useState(false);
  const [editBranchMode, setEditBranchMode] = useState(false);
  const [selectedTenantForBranch, setSelectedTenantForBranch] = useState<string>('');
  const [, setSelectedBranch] = useState<Branch | null>(null);
  
  // Delete Confirmation Dialog
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [tenantToDelete, setTenantToDelete] = useState<Tenant | null>(null);
  
  // Expanded Rows
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  
  const [tenantFormData, setTenantFormData] = useState<Record<string, string>>({
    Id: '',
    TenantName: '',
    TenantCode: '',
    CreationDate: new Date().toISOString().split('T')[0],
    Address: '',
    PhoneNumber: '',
    WhatsAppNumber: '',
    Email: '',
    Governorate: '',
    FacilityName: '',
    Activity: '',
    ResponsibleName: '',
  });

  const [branchFormData, setBranchFormData] = useState<Record<string, string>>({
    Id: '',
    Name: '',
    ExpireDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    Address: '',
    Governate: '',
    Phone: '',
    TenantId: '',
    BranchId: '',
  });

  useEffect(() => {
    if (!token) {
      navigate('/auth/login');
    }
  }, [token, navigate]);

  const fetchTenants = async () => {
    if (!token) return;
    setLoading(true);
    setError('');
    try {
      const data = await getTenants(token);
      setTenants(data);
    } catch (err: any) {
      console.error('Error fetching tenants:', err);
      setError(err.message || 'Failed to load tenants');
    } finally {
      setLoading(false);
    }
  };

  const fetchBranches = async () => {
    if (!token) return;
    setLoadingBranches(true);
    try {
      const data = await getBranches(token);
      setBranches(data);
    } catch (err: any) {
      console.error('Error fetching branches:', err);
    } finally {
      setLoadingBranches(false);
    }
  };

  useEffect(() => {
    fetchTenants();
    fetchBranches();
  }, [token]);

  const handleSort = (field: SortableField) => {
    const isAsc = orderBy === field && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(field);
  };

  const filteredAndSortedTenants = useMemo(() => {
    let filtered = [...tenants];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(tenant =>
        tenant.tenantName?.toLowerCase().includes(query) ||
        tenant.tenantCode?.toLowerCase().includes(query) ||
        tenant.dbName?.toLowerCase().includes(query) ||
        tenant.phoneNumber?.toLowerCase().includes(query) ||
        tenant.email?.toLowerCase().includes(query) ||
        tenant.address?.toLowerCase().includes(query) ||
        tenant.governorate?.toLowerCase().includes(query)
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
  }, [tenants, searchQuery, orderBy, order]);

  const handleTenantChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTenantFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBranchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBranchFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOpenAddTenant = () => {
    setEditTenantMode(false);
    setTenantFormData({
      Id: '',
      TenantName: '',
      TenantCode: '',
      CreationDate: new Date().toISOString().split('T')[0],
      Address: '',
      PhoneNumber: '',
      WhatsAppNumber: '',
      Email: '',
      Governorate: '',
      FacilityName: '',
      Activity: '',
      ResponsibleName: '',
    });
    setOpenTenantDialog(true);
  };

  const handleOpenEditTenant = (tenant: Tenant) => {
    setEditTenantMode(true);
    setTenantFormData({
      Id: tenant.id,
      TenantName: tenant.tenantName,
      TenantCode: tenant.tenantCode,
      CreationDate: tenant.creationDate ? tenant.creationDate.split('T')[0] : new Date().toISOString().split('T')[0],
      Address: tenant.address || '',
      PhoneNumber: tenant.phoneNumber || '',
      WhatsAppNumber: tenant.whatsAppNumber || '',
      Email: tenant.email || '',
      Governorate: tenant.governorate || '',
      FacilityName: tenant.facilityName || '',
      Activity: tenant.activity || '',
      ResponsibleName: tenant.responsibleName || '',
    });
    setOpenTenantDialog(true);
  };

  const handleOpenAddBranch = (tenantId: string) => {
    setEditBranchMode(false);
    setSelectedBranch(null);
    setSelectedTenantForBranch(tenantId);
    setBranchFormData({
      Id: tenantId,
      Name: '',
      ExpireDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      Address: '',
      Governate: '',
      Phone: '',
      TenantId: tenantId,
      BranchId: '',
    });
    setOpenBranchDialog(true);
  };

  const handleOpenEditBranch = (branch: Branch, tenantId: string) => {
    setEditBranchMode(true);
    setSelectedBranch(branch);
    setSelectedTenantForBranch(tenantId);
    setBranchFormData({
      Id: branch.id,
      Name: branch.name,
      ExpireDate: branch.expireDate ? branch.expireDate.split('T')[0] : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      Address: branch.address || '',
      Governate: branch.governate || '',
      Phone: branch.phone || '',
      TenantId: branch.tenantId || tenantId,
      BranchId: branch.branchId || '',
    });
    setOpenBranchDialog(true);
  };

  const handleOpenDeleteDialog = (tenant: Tenant) => {
    setTenantToDelete(tenant);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!token || !tenantToDelete) return;
    setError('');
    setSuccess('');
    
    try {
      await deleteTenant(tenantToDelete.id, token);
      setSuccess(t('Tenant deleted successfully'));
      await fetchTenants();
      setOpenDeleteDialog(false);
      setTenantToDelete(null);
    } catch (err: any) {
      console.error('Error deleting tenant:', err);
      setError(err.message || 'Failed to delete tenant');
      setOpenDeleteDialog(false);
    }
  };

  const handleSubmitTenant = async () => {
    if (!token) return;
    setError('');
    setSuccess('');
    
    try {
      if (editTenantMode) {
        await updateTenant(tenantFormData, token);
        setSuccess(t('Tenant updated successfully'));
      } else {
        await addTenant(tenantFormData, token);
        setSuccess(t('Tenant added successfully'));
      }
      
      await fetchTenants();
      setOpenTenantDialog(false);
    } catch (err: any) {
      console.error('Error saving tenant:', err);
      setError(err.message || 'Failed to save tenant');
    }
  };

  const handleSubmitBranch = async () => {
    if (!token) return;
    setError('');
    setSuccess('');
    
    try {
      if (editBranchMode) {
        await updateBranch(branchFormData, token);
        setSuccess(t('Branch updated successfully'));
      } else {
        await addBranch(branchFormData, token);
        setSuccess(t('Branch added successfully'));
      }
      
      await fetchBranches();
      setOpenBranchDialog(false);
      setEditBranchMode(false);
      
      if (!editBranchMode) {
        setExpandedRows(prev => new Set(prev).add(selectedTenantForBranch));
      }
    } catch (err: any) {
      console.error('Error saving branch:', err);
      setError(err.message || 'Failed to save branch');
    }
  };

  const toggleRow = (tenantId: string) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(tenantId)) {
        newSet.delete(tenantId);
      } else {
        newSet.add(tenantId);
      }
      return newSet;
    });
  };

  const getTenantBranches = (tenantId: string): Branch[] => {
    return branches.filter(branch => branch.id === tenantId || branch.tenantId === tenantId);
  };

  const breadcrumbItems = [
    { to: '/', title: t('Home') },
    { title: t('Tenants') },
  ];

  return (
    <PageContainer title={t('Tenants')} description={t('Tenants') + ' Management'}>
      <Breadcrumb title={t('Tenants')} items={breadcrumbItems} />
      
      <DashboardCard
        title={t('Tenants & Branches')}
        action={
          <Button 
            variant="contained" 
            startIcon={<IconPlus />}
            onClick={handleOpenAddTenant}
            size={isMobile ? 'small' : 'medium'}
          >
            {isMobile ? t('Add') : t('Add Tenant')}
          </Button>
        }
      >
        {/* Search Box */}
        <Box mb={3}>
          <TextField
            fullWidth
            placeholder={t('Search by name, code, database, phone, email...')}
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
              {t('Found')} {filteredAndSortedTenants.length} {t('results')}
            </Typography>
          )}
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : filteredAndSortedTenants.length === 0 ? (
          <Box textAlign="center" p={3}>
            <Typography variant="h6" color="textSecondary">
              {searchQuery ? t('No tenants found matching your search') : t('No tenants found')}
            </Typography>
          </Box>
        ) : isMobile ? (
          // ==================== MOBILE CARD VIEW ====================
          <Stack spacing={2}>
            {filteredAndSortedTenants.map((tenant) => {
              const tenantBranches = getTenantBranches(tenant.id);
              const isExpanded = expandedRows.has(tenant.id);
              
              return (
                <Card key={tenant.id} variant="outlined">
                  <CardContent>
                    <Stack spacing={2}>
                      {/* Header with Actions */}
                      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                        <Box flex={1}>
                          <Typography variant="h6" fontWeight="bold">
                            {tenant.tenantName}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {t('Code')}: {tenant.tenantCode}
                          </Typography>
                        </Box>
                        <Stack direction="row" spacing={0.5}>
                          <IconButton 
                            color="primary" 
                            size="small"
                            onClick={() => handleOpenEditTenant(tenant)}
                          >
                            <IconEdit size={18} />
                          </IconButton>
                          <IconButton 
                            color="secondary" 
                            size="small"
                            onClick={() => handleOpenAddBranch(tenant.id)}
                          >
                            <IconBuildingStore size={18} />
                          </IconButton>
                          <IconButton 
                            color="error" 
                            size="small"
                            onClick={() => handleOpenDeleteDialog(tenant)}
                          >
                            <IconTrash size={18} />
                          </IconButton>
                        </Stack>
                      </Stack>

                      <Divider />

                      {/* Details */}
                      <Box>
                        <Stack spacing={1}>
                          <Stack direction="row" spacing={1}>
                            <Typography variant="body2" color="textSecondary" sx={{ minWidth: 80 }}>
                              {t('Database')}:
                            </Typography>
                            <Typography variant="body2" fontWeight="500">
                              {tenant.dbName}
                            </Typography>
                          </Stack>
                          
                          {tenant.phoneNumber && (
                            <Stack direction="row" spacing={1}>
                              <Typography variant="body2" color="textSecondary" sx={{ minWidth: 80 }}>
                                {t('Phone')}:
                              </Typography>
                              <Typography variant="body2" fontWeight="500">
                                {tenant.phoneNumber}
                              </Typography>
                            </Stack>
                          )}
                          
                          {tenant.email && (
                            <Stack direction="row" spacing={1}>
                              <Typography variant="body2" color="textSecondary" sx={{ minWidth: 80 }}>
                                {t('Email')}:
                              </Typography>
                              <Typography variant="body2" fontWeight="500" sx={{ wordBreak: 'break-all' }}>
                                {tenant.email}
                              </Typography>
                            </Stack>
                          )}

                          <Stack direction="row" spacing={1} alignItems="center">
                            <Typography variant="body2" color="textSecondary" sx={{ minWidth: 80 }}>
                              {t('Status')}:
                            </Typography>
                            <Chip 
                              label={tenant.isActive ? t('Active') : t('Inactive')} 
                              color={tenant.isActive ? 'success' : 'default'}
                              size="small"
                            />
                          </Stack>
                        </Stack>
                      </Box>

                      {/* Branches Toggle */}
                      {tenantBranches.length > 0 && (
                        <>
                          <Divider />
                          <Button
                            size="small"
                            onClick={() => toggleRow(tenant.id)}
                            endIcon={isExpanded ? <IconChevronDown size={16} /> : <IconChevronRight size={16} />}
                            sx={{ justifyContent: 'flex-start' }}
                          >
                            {t('Branches')} ({tenantBranches.length})
                          </Button>

                          <Collapse in={isExpanded}>
                            <Stack spacing={1.5} sx={{ pl: 1, pt: 1 }}>
                              {tenantBranches.map((branch) => (
                                <Card key={branch.branchId || branch.id} variant="outlined" sx={{ bgcolor: 'grey.50' }}>
                                  <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                                    <Stack spacing={1}>
                                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                                        <Typography variant="subtitle2" fontWeight="bold">
                                          {branch.name}
                                        </Typography>
                                        <IconButton 
                                          color="primary" 
                                          size="small"
                                          onClick={() => handleOpenEditBranch(branch, tenant.id)}
                                        >
                                          <IconEdit size={14} />
                                        </IconButton>
                                      </Stack>
                                      
                                      {branch.address && (
                                        <Typography variant="caption" color="textSecondary">
                                          📍 {branch.address}
                                        </Typography>
                                      )}
                                      
                                      {branch.phone && (
                                        <Typography variant="caption">
                                          📞 {branch.phone}
                                        </Typography>
                                      )}

                                      <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                                        <Chip 
                                          label={branch.isActive ? t('Active') : t('Inactive')} 
                                          color={branch.isActive ? 'success' : 'default'}
                                          size="small"
                                        />
                                        {branch.expireDate && (
                                          <Typography variant="caption" color="textSecondary">
                                            ⏰ {new Date(branch.expireDate).toLocaleDateString()}
                                          </Typography>
                                        )}
                                      </Stack>
                                    </Stack>
                                  </CardContent>
                                </Card>
                              ))}
                            </Stack>
                          </Collapse>
                        </>
                      )}
                    </Stack>
                  </CardContent>
                </Card>
              );
            })}
          </Stack>
        ) : (
          // ==================== DESKTOP TABLE VIEW ====================
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell width={50}></TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'tenantName'}
                      direction={orderBy === 'tenantName' ? order : 'asc'}
                      onClick={() => handleSort('tenantName')}
                    >
                      <strong>{t('Name')}</strong>
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'tenantCode'}
                      direction={orderBy === 'tenantCode' ? order : 'asc'}
                      onClick={() => handleSort('tenantCode')}
                    >
                      <strong>{t('Code')}</strong>
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'dbName'}
                      direction={orderBy === 'dbName' ? order : 'asc'}
                      onClick={() => handleSort('dbName')}
                    >
                      <strong>{t('Database')}</strong>
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
                {filteredAndSortedTenants.map((tenant) => {
                  const tenantBranches = getTenantBranches(tenant.id);
                  const isExpanded = expandedRows.has(tenant.id);
                  
                  return (
                    <React.Fragment key={tenant.id}>
                      <TableRow hover>
                        <TableCell>
                          <IconButton 
                            size="small" 
                            onClick={() => toggleRow(tenant.id)}
                            disabled={tenantBranches.length === 0}
                          >
                            {tenantBranches.length > 0 ? (
                              isExpanded ? <IconChevronDown size={18} /> : <IconChevronRight size={18} />
                            ) : null}
                          </IconButton>
                        </TableCell>
                        <TableCell>{tenant.tenantName}</TableCell>
                        <TableCell>{tenant.tenantCode}</TableCell>
                        <TableCell>{tenant.dbName}</TableCell>
                        <TableCell>{tenant.phoneNumber || '-'}</TableCell>
                        <TableCell>{tenant.email || '-'}</TableCell>
                        <TableCell>
                          <Chip 
                            label={tenant.isActive ? t('Active') : t('Inactive')} 
                            color={tenant.isActive ? 'success' : 'default'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Stack direction="row" spacing={1} justifyContent="center">
                            <IconButton 
                              color="primary" 
                              size="small"
                              onClick={() => handleOpenEditTenant(tenant)}
                              title={t('Edit Tenant')}
                            >
                              <IconEdit size={18} />
                            </IconButton>
                            <IconButton 
                              color="secondary" 
                              size="small"
                              onClick={() => handleOpenAddBranch(tenant.id)}
                              title={t('Add Branch')}
                            >
                              <IconBuildingStore size={18} />
                            </IconButton>
                            <IconButton 
                              color="error" 
                              size="small"
                              onClick={() => handleOpenDeleteDialog(tenant)}
                              title={t('Delete Tenant')}
                            >
                              <IconTrash size={18} />
                            </IconButton>
                          </Stack>
                        </TableCell>
                      </TableRow>
                      
                      <TableRow>
                        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
                          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                            <Box sx={{ margin: 2, bgcolor: 'grey.50', borderRadius: 1, p: 2 }}>
                              <Typography variant="h6" gutterBottom component="div" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <IconBuildingStore size={20} />
                                {t('Branches')} ({tenantBranches.length})
                              </Typography>
                              {loadingBranches ? (
                                <CircularProgress size={24} />
                              ) : tenantBranches.length === 0 ? (
                                <Typography variant="body2" color="textSecondary">
                                  {t('No branches found for this tenant')}
                                </Typography>
                              ) : (
                                <Table size="small">
                                  <TableHead>
                                    <TableRow>
                                      <TableCell><strong>{t('Name')}</strong></TableCell>
                                      <TableCell><strong>{t('Address')}</strong></TableCell>
                                      <TableCell><strong>{t('Governate')}</strong></TableCell>
                                      <TableCell><strong>{t('Phone')}</strong></TableCell>
                                      <TableCell><strong>{t('Expire Date')}</strong></TableCell>
                                      <TableCell><strong>{t('Status')}</strong></TableCell>
                                      <TableCell align="center"><strong>{t('Actions')}</strong></TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {tenantBranches.map((branch) => (
                                      <TableRow key={branch.branchId || branch.id}>
                                        <TableCell>{branch.name}</TableCell>
                                        <TableCell>{branch.address || '-'}</TableCell>
                                        <TableCell>{branch.governate || '-'}</TableCell>
                                        <TableCell>{branch.phone || '-'}</TableCell>
                                        <TableCell>
                                          {branch.expireDate ? new Date(branch.expireDate).toLocaleDateString() : '-'}
                                        </TableCell>
                                        <TableCell>
                                          <Chip 
                                            label={branch.isActive ? t('Active') : t('Inactive')} 
                                            color={branch.isActive ? 'success' : 'default'}
                                            size="small"
                                          />
                                        </TableCell>
                                        <TableCell align="center">
                                          <IconButton 
                                            color="primary" 
                                            size="small"
                                            onClick={() => handleOpenEditBranch(branch, tenant.id)}
                                            title={t('Edit Branch')}
                                          >
                                            <IconEdit size={16} />
                                          </IconButton>
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              )}
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DashboardCard>

      {/* Tenant Dialog */}
      <Dialog open={openTenantDialog} onClose={() => setOpenTenantDialog(false)} fullWidth maxWidth="md">
        <DialogTitle>
          {editTenantMode ? t('Edit Tenant') : t('Add Tenant')}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Stack spacing={2}>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <TextField
                  label={t('Tenant Name')}
                  name="TenantName"
                  fullWidth
                  required
                  value={tenantFormData.TenantName}
                  onChange={handleTenantChange}
                />
                <TextField
                  label={t('Tenant Code')}
                  name="TenantCode"
                  fullWidth
                  required
                  value={tenantFormData.TenantCode}
                  onChange={handleTenantChange}
                />
              </Stack>

              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <TextField
                  label={t('Facility Name')}
                  name="FacilityName"
                  fullWidth
                  value={tenantFormData.FacilityName}
                  onChange={handleTenantChange}
                />
                <TextField
                  label={t('Activity')}
                  name="Activity"
                  fullWidth
                  value={tenantFormData.Activity}
                  onChange={handleTenantChange}
                />
              </Stack>

              <TextField
                label={t('Address')}
                name="Address"
                fullWidth
                value={tenantFormData.Address}
                onChange={handleTenantChange}
              />

              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <TextField
                  label={t('Governorate')}
                  name="Governorate"
                  fullWidth
                  value={tenantFormData.Governorate}
                  onChange={handleTenantChange}
                />
                <TextField
                  label={t('Responsible Name')}
                  name="ResponsibleName"
                  fullWidth
                  value={tenantFormData.ResponsibleName}
                  onChange={handleTenantChange}
                />
              </Stack>

              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <TextField
                  label={t('Phone Number')}
                  name="PhoneNumber"
                  fullWidth
                  value={tenantFormData.PhoneNumber}
                  onChange={handleTenantChange}
                />
                <TextField
                  label={t('WhatsApp Number')}
                  name="WhatsAppNumber"
                  fullWidth
                  value={tenantFormData.WhatsAppNumber}
                  onChange={handleTenantChange}
                />
              </Stack>

              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <TextField
                  label={t('Email')}
                  name="Email"
                  type="email"
                  fullWidth
                  value={tenantFormData.Email}
                  onChange={handleTenantChange}
                />
                <TextField
                  label={t('Creation Date')}
                  name="CreationDate"
                  type="date"
                  fullWidth
                  value={tenantFormData.CreationDate}
                  onChange={handleTenantChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Stack>
            </Stack>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenTenantDialog(false)}>{t('Cancel')}</Button>
          <Button 
            onClick={handleSubmitTenant} 
            variant="contained"
            disabled={!tenantFormData.TenantName || !tenantFormData.TenantCode}
          >
            {editTenantMode ? t('Update') : t('Add')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Branch Dialog */}
      <Dialog open={openBranchDialog} onClose={() => setOpenBranchDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle>
          {editBranchMode ? t('Edit Branch') : t('Add Branch')}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Stack spacing={2}>
              <TextField
                label={t('Branch ID')}
                name="Id"
                fullWidth
                required
                value={branchFormData.Id}
                onChange={handleBranchChange}
                disabled={editBranchMode}
              />
              <TextField
                label={t('Branch Name')}
                name="Name"
                fullWidth
                required
                value={branchFormData.Name}
                onChange={handleBranchChange}
              />
              <TextField
                label={t('Address')}
                name="Address"
                fullWidth
                value={branchFormData.Address}
                onChange={handleBranchChange}
              />
              <TextField
                label={t('Governate')}
                name="Governate"
                fullWidth
                value={branchFormData.Governate}
                onChange={handleBranchChange}
              />
              <TextField
                label={t('Phone')}
                name="Phone"
                fullWidth
                value={branchFormData.Phone}
                onChange={handleBranchChange}
              />
              <TextField
                label={t('Expire Date')}
                name="ExpireDate"
                type="date"
                fullWidth
                value={branchFormData.ExpireDate}
                onChange={handleBranchChange}
                InputLabelProps={{ shrink: true }}
              />
            </Stack>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenBranchDialog(false)}>{t('Cancel')}</Button>
          <Button 
            onClick={handleSubmitBranch} 
            variant="contained"
            disabled={!branchFormData.Id || !branchFormData.Name}
          >
            {editBranchMode ? t('Update') : t('Add')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)} maxWidth="xs" fullWidth>
        <DialogTitle>{t('Confirm Delete')}</DialogTitle>
        <DialogContent>
          <Typography>
            {t('Are you sure you want to delete tenant')} "{tenantToDelete?.tenantName}"?
          </Typography>
          <Typography variant="body2" color="error" mt={2}>
            {t('This action cannot be undone.')}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>{t('Cancel')}</Button>
          <Button onClick={handleConfirmDelete} variant="contained" color="error">
            {t('Delete')}
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

export default Tenants;
