import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  MenuItem,
  Chip,
  Select,
  FormControl,
  InputLabel,
  Grid,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Tooltip,
  Fade,
  InputAdornment,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { addJob, updateJob, deleteJob, updateJobStatus, fetchJobsFromStorage } from '../store/slices/jobsSlice';
import { addNotification, createJobNotification } from '../store/slices/notificationsSlice';
import { useNavigate } from 'react-router-dom';
import { getShips, getComponents } from '../utils/localStorage';
import { format } from 'date-fns';

const statusOptions = [
  'Scheduled',
  'In Progress',
  'Completed',
  'Cancelled',
];

const priorityOptions = ['Low', 'Medium', 'High', 'Critical'];

const getStatusColor = (status) => {
  switch (status) {
    case 'Completed':
      return 'success';
    case 'In Progress':
      return 'info';
    case 'Cancelled':
      return 'error';
    default:
      return 'warning';
  }
};

const getPriorityColor = (priority) => {
  switch (priority) {
    case 'Critical':
    case 'High':
      return 'error';
    case 'Medium':
      return 'warning';
    default:
      return 'default';
  }
};

const JobsPage = () => {
  const [open, setOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);
  const [editingJob, setEditingJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    type: '',
    priority: 'Medium',
    status: 'Scheduled',
    scheduledDate: '',
    componentId: '',
    shipId: '',
    assignedEngineerId: '',
  });
  const [filters, setFilters] = useState({
    shipId: '',
    status: '',
    priority: '',
  });
  const [dialogComponents, setDialogComponents] = useState([]);
  const [allComponents, setAllComponents] = useState([]);

  const dispatch = useDispatch();
  const jobs = useSelector((state) => state.jobs.jobs);
  const components = useSelector((state) => state.components.components);
  const [ships, setShips] = useState([]);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await dispatch(fetchJobsFromStorage());
      const shipsList = getShips();
      setShips(shipsList);
      
      const flatComponents = shipsList.flatMap(ship =>
        (ship.components || []).map(c => ({ ...c, shipId: ship.id }))
      );
      setAllComponents(flatComponents);
      setLoading(false);
    };
    loadData();
  }, [dispatch]);

  useEffect(() => {
    if (open && formData.shipId) {
      const comps = getComponents(formData.shipId) || [];
      setDialogComponents(comps);
    } else if (open) {
      setDialogComponents([]);
    }
  }, [open, formData.shipId]);

  const handleOpen = (job = null) => {
    if (job) {
      setEditingJob(job);
      setFormData(job);
    } else {
      setEditingJob(null);
      setFormData({
        type: '',
        priority: 'Medium',
        status: 'Scheduled',
        scheduledDate: '',
        componentId: '',
        shipId: '',
        assignedEngineerId: '',
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingJob(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const jobData = {
      ...formData,
      id: editingJob ? editingJob.id : `j${Date.now()}`,
    };

    if (editingJob) {
      dispatch(updateJob(jobData));
      dispatch(addNotification(createJobNotification('updated', jobData)));
    } else {
      dispatch(addJob(jobData));
      dispatch(addNotification(createJobNotification('created', jobData)));
    }
    dispatch(fetchJobsFromStorage());
    handleClose();
  };

  const handleDeleteClick = (job) => {
    setJobToDelete(job);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (jobToDelete) {
      dispatch(deleteJob(jobToDelete.id));
      dispatch(fetchJobsFromStorage());
      setDeleteDialogOpen(false);
      setJobToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setJobToDelete(null);
  };

  const handleStatusChange = (jobId, newStatus) => {
    dispatch(updateJobStatus({ jobId, status: newStatus }));
    const job = jobs.find((j) => j.id === jobId);
    if (job && newStatus === 'Completed') {
      dispatch(addNotification(createJobNotification('completed', job)));
    }
    dispatch(fetchJobsFromStorage());
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = 
      job.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      getShipName(job.shipId).toLowerCase().includes(searchQuery.toLowerCase()) ||
      getComponentName(job.componentId).toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilters = 
      (!filters.shipId || job.shipId === filters.shipId) &&
      (!filters.status || job.status === filters.status) &&
      (!filters.priority || job.priority === filters.priority);

    return matchesSearch && matchesFilters;
  });

  const getShipName = (shipId) => {
    const ship = ships.find((s) => s.id === shipId);
    return ship ? ship.name : 'Unknown';
  };

  const getComponentName = (componentId) => {
    const component = allComponents.find((c) => c.id === componentId);
    return component ? component.name : 'Unknown';
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between', 
        alignItems: { xs: 'stretch', sm: 'center' },
        mb: 3,
        gap: 2
      }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Maintenance Jobs
        </Typography>
        {user?.role === 'Admin' && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpen()}
            sx={{ width: { xs: '100%', sm: 'auto' } }}
          >
            Add Job
          </Button>
        )}
      </Box>


      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search jobs by type, ship, or component..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Ship</InputLabel>
              <Select
                name="shipId"
                value={filters.shipId}
                label="Ship"
                onChange={handleFilterChange}
              >
                <MenuItem value="">All Ships</MenuItem>
                {ships.map((ship) => (
                  <MenuItem key={ship.id} value={ship.id}>
                    {ship.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={filters.status}
                label="Status"
                onChange={handleFilterChange}
              >
                <MenuItem value="">All Statuses</MenuItem>
                {statusOptions.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                name="priority"
                value={filters.priority}
                label="Priority"
                onChange={handleFilterChange}
              >
                <MenuItem value="">All Priorities</MenuItem>
                {priorityOptions.map((priority) => (
                  <MenuItem key={priority} value={priority}>
                    {priority}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
          <Table size={isMobile ? "small" : "medium"}>
            <TableHead>
              <TableRow>
                <TableCell>Type</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Scheduled Date</TableCell>
                <TableCell>Ship</TableCell>
                <TableCell>Component</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredJobs.length > 0 ? (
                filteredJobs.map((job) => (
                  <Fade in={true} key={job.id}>
                    <TableRow
                      hover
                      sx={{
                        '&:last-child td, &:last-child th': { border: 0 },
                        transition: 'background-color 0.2s',
                      }}
                    >
                      <TableCell>{job.type}</TableCell>
                      <TableCell>
                        <Chip
                          label={job.priority}
                          color={getPriorityColor(job.priority)}
                          size="small"
                          icon={
                            job.priority === 'Critical' ? <ErrorIcon /> :
                            job.priority === 'High' ? <WarningIcon /> :
                            <CheckCircleIcon />
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Select
                          value={job.status}
                          onChange={(e) => handleStatusChange(job.id, e.target.value)}
                          size="small"
                          sx={{
                            minWidth: 120,
                            '& .MuiSelect-select': {
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                            },
                          }}
                        >
                          {statusOptions.map((status) => (
                            <MenuItem key={status} value={status}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                {status === 'Completed' ? <CheckCircleIcon color="success" /> :
                                 status === 'In Progress' ? <ScheduleIcon color="info" /> :
                                 status === 'Cancelled' ? <ErrorIcon color="error" /> :
                                 <ScheduleIcon color="warning" />}
                                {status}
                              </Box>
                            </MenuItem>
                          ))}
                        </Select>
                      </TableCell>
                      <TableCell>
                        {format(new Date(job.scheduledDate), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell>{getShipName(job.shipId)}</TableCell>
                      <TableCell>{getComponentName(job.componentId)}</TableCell>
                      <TableCell align="right">
                        {user?.role === 'Admin' && (
                          <>
                            <Tooltip title="Edit">
                              <IconButton onClick={() => handleOpen(job)} color="primary">
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton onClick={() => handleDeleteClick(job)} color="error">
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  </Fade>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                    <Typography color="text.secondary">
                      {searchQuery || Object.values(filters).some(Boolean)
                        ? 'No jobs found matching your criteria'
                        : 'No jobs available'}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      
      <Dialog 
        open={open} 
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
          },
        }}
      >
        <DialogTitle>
          {editingJob ? 'Edit Job' : 'Add New Job'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Type"
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
              margin="normal"
              required
            />
            <TextField
              fullWidth
              select
              label="Priority"
              value={formData.priority}
              onChange={(e) =>
                setFormData({ ...formData, priority: e.target.value })
              }
              margin="normal"
              required
            >
              {priorityOptions.map((priority) => (
                <MenuItem key={priority} value={priority}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {priority === 'Critical' ? <ErrorIcon color="error" /> :
                     priority === 'High' ? <WarningIcon color="error" /> :
                     priority === 'Medium' ? <WarningIcon color="warning" /> :
                     <CheckCircleIcon color="default" />}
                    {priority}
                  </Box>
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              select
              label="Status"
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              margin="normal"
              required
            >
              {statusOptions.map((status) => (
                <MenuItem key={status} value={status}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {status === 'Completed' ? <CheckCircleIcon color="success" /> :
                     status === 'In Progress' ? <ScheduleIcon color="info" /> :
                     status === 'Cancelled' ? <ErrorIcon color="error" /> :
                     <ScheduleIcon color="warning" />}
                    {status}
                  </Box>
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              type="date"
              label="Scheduled Date"
              value={formData.scheduledDate}
              onChange={(e) =>
                setFormData({ ...formData, scheduledDate: e.target.value })
              }
              margin="normal"
              required
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              select
              label="Ship"
              value={formData.shipId}
              onChange={(e) =>
                setFormData({ ...formData, shipId: e.target.value })
              }
              margin="normal"
              required
            >
              {ships.map((ship) => (
                <MenuItem key={ship.id} value={ship.id}>
                  {ship.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              select
              label="Component"
              value={formData.componentId}
              onChange={(e) =>
                setFormData({ ...formData, componentId: e.target.value })
              }
              margin="normal"
              required
              disabled={!formData.shipId}
            >
              {(dialogComponents || []).map((component) => (
                <MenuItem key={component.id} value={component.id}>
                  {component.name}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          {user?.role === 'Admin' && (
            <Button onClick={handleSubmit} variant="contained">
              {editingJob ? 'Update' : 'Add'}
            </Button>
          )}
        </DialogActions>
      </Dialog>

    
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        PaperProps={{
          sx: {
            borderRadius: 2,
            minWidth: { xs: '90%', sm: 400 },
          },
        }}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the job "{jobToDelete?.type}"?
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          {user?.role === 'Admin' && (
            <Button onClick={handleDeleteConfirm} color="error" variant="contained">
              Delete
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default JobsPage; 