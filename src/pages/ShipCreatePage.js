import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  MenuItem,
  Grid,
} from '@mui/material';
import { addShip } from '../utils/localStorage';
import useForm from '../hooks/useForm';

const ShipCreatePage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useForm({
    name: '',
    imoNumber: '',
    flag: '',
    status: 'Active',
  });

  const onSubmit = (formValues) => {
    try {
      const newShip = {
        id: `s${Date.now()}`,
        ...formValues,
        components: [],
        maintenanceHistory: [],
      };
      addShip(newShip);
      navigate('/ships');
    } catch (err) {
      setError('Failed to create ship. Please try again.');
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Add New Ship
        </Typography>

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="name"
                label="Ship Name"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.name && Boolean(errors.name)}
                helperText={touched.name && errors.name}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="imoNumber"
                label="IMO Number"
                value={values.imoNumber}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.imoNumber && Boolean(errors.imoNumber)}
                helperText={touched.imoNumber && errors.imoNumber}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="flag"
                label="Flag"
                value={values.flag}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.flag && Boolean(errors.flag)}
                helperText={touched.flag && errors.flag}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                name="status"
                label="Status"
                value={values.status}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.status && Boolean(errors.status)}
                helperText={touched.status && errors.status}
                required
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Maintenance">Under Maintenance</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/ships')}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                >
                  Create Ship
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default ShipCreatePage; 