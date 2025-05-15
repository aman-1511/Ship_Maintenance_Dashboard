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
  CircularProgress,
} from '@mui/material';
import { getShip, updateShip } from '../utils/localStorage';
import useForm from '../hooks/useForm';

const ShipEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    setValues,
  } = useForm({
    name: '',
    imoNumber: '',
    flag: '',
    status: '',
  });

  useEffect(() => {
    const loadShip = () => {
      try {
        const ship = getShip(id);
        if (ship) {
          setValues({
            name: ship.name,
            imoNumber: ship.imoNumber,
            flag: ship.flag,
            status: ship.status,
          });
        } else {
          setError('Ship not found');
        }
      } catch (err) {
        setError('Failed to load ship details');
      } finally {
        setLoading(false);
      }
    };

    loadShip();
  }, [id, setValues]);

  const onSubmit = (formValues) => {
    try {
      const updatedShip = {
        id,
        ...formValues,
      };
      updateShip(updatedShip);
      navigate('/ships');
    } catch (err) {
      setError('Failed to update ship. Please try again.');
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
          Edit Ship
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
                  Update Ship
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default ShipEditPage; 