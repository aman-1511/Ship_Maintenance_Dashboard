import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  MenuItem,
  Grid,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
} from '@mui/material';
import { getJob, updateJob, getShips, getUsers } from '../utils/localStorage';
import useForm from '../hooks/useForm';

const JobEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [ships, setShips] = useState([]);
  const [engineers, setEngineers] = useState([]);
  const [components, setComponents] = useState([]);

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    setValues,
  } = useForm({
    shipId: '',
    componentId: '',
    type: '',
    priority: '',
    status: '',
    assignedTo: '',
    scheduledDate: '',
    description: '',
  });

  useEffect(() => {
    const loadData = () => {
      try {
       
        const job = getJob(id);
        if (!job) {
          setError('Job not found');
          return;
        }

      
        const shipsList = getShips();
        const usersList = getUsers();
        const engineersList = usersList.filter(user => user.role === 'Engineer');
        
        setShips(shipsList);
        setEngineers(engineersList);

        
        setValues({
          shipId: job.shipId,
          componentId: job.componentId,
          type: job.type,
          priority: job.priority,
          status: job.status,
          assignedTo: job.assignedTo,
          scheduledDate: job.scheduledDate,
          description: job.description,
        });

       
        const selectedShip = shipsList.find(ship => ship.id === job.shipId);
        if (selectedShip) {
          setComponents(selectedShip.components);
        }
      } catch (err) {
        setError('Failed to load job details');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, setValues]);

  useEffect(() => {
    
    if (values.shipId) {
      const selectedShip = ships.find(ship => ship.id === values.shipId);
      setComponents(selectedShip ? selectedShip.components : []);
    } else {
      setComponents([]);
    }
  }, [values.shipId, ships]);

  const onSubmit = (formValues) => {
    try {
      const updatedJob = {
        id,
        ...formValues,
      };
      updateJob(updatedJob);
      navigate('/jobs');
    } catch (err) {
      setError('Failed to update job. Please try again.');
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Edit Job
        </Typography>

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Ship</InputLabel>
                <Select
                  name="shipId"
                  value={values.shipId}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.shipId && Boolean(errors.shipId)}
                >
                  {ships.map((ship) => (
                    <MenuItem key={ship.id} value={ship.id}>
                      {ship.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Component</InputLabel>
                <Select
                  name="componentId"
                  value={values.componentId}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.componentId && Boolean(errors.componentId)}
                  disabled={!values.shipId}
                >
                  {components.map((component) => (
                    <MenuItem key={component.id} value={component.id}>
                      {component.name} ({component.serialNumber})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                name="type"
                label="Job Type"
                value={values.type}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.type && Boolean(errors.type)}
                required
              >
                <MenuItem value="Routine Maintenance">Routine Maintenance</MenuItem>
                <MenuItem value="Emergency Repair">Emergency Repair</MenuItem>
                <MenuItem value="Inspection">Inspection</MenuItem>
                <MenuItem value="Installation">Installation</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                name="priority"
                label="Priority"
                value={values.priority}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.priority && Boolean(errors.priority)}
                required
              >
                <MenuItem value="Low">Low</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="High">High</MenuItem>
                <MenuItem value="Critical">Critical</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                name="status"
                label="Status"
                value={values.status}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.status && Boolean(errors.status)}
                required
              >
                <MenuItem value="Scheduled">Scheduled</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
                <MenuItem value="Cancelled">Cancelled</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                name="assignedTo"
                label="Assigned Engineer"
                value={values.assignedTo}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.assignedTo && Boolean(errors.assignedTo)}
                required
              >
                {engineers.map((engineer) => (
                  <MenuItem key={engineer.id} value={engineer.id}>
                    {engineer.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                name="scheduledDate"
                label="Scheduled Date"
                value={values.scheduledDate}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.scheduledDate && Boolean(errors.scheduledDate)}
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                name="description"
                label="Description"
                value={values.description}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.description && Boolean(errors.description)}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/jobs')}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                >
                  Update Job
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default JobEditPage; 