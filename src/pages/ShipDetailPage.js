import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Button,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Edit as EditIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { getShip } from '../utils/localStorage';

const ShipDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [ship, setShip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const loadShip = () => {
      try {
        const shipData = getShip(id);
        if (shipData) {
          setShip(shipData);
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
  }, [id]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'success';
      case 'maintenance':
        return 'warning';
      case 'inactive':
        return 'error';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, textAlign: 'center' }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  if (error || !ship) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography color="error">{error || 'Ship not found'}</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h4" component="h1">
            {ship.name}
          </Typography>
          {user.role === 'Admin' && (
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={() => navigate(`/ships/${id}/edit`)}
            >
              Edit Ship
            </Button>
          )}
        </Box>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle2" color="text.secondary">
              IMO Number
            </Typography>
            <Typography variant="body1">{ship.imoNumber}</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle2" color="text.secondary">
              Flag
            </Typography>
            <Typography variant="body1">{ship.flag}</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle2" color="text.secondary">
              Status
            </Typography>
            <Chip
              label={ship.status}
              color={getStatusColor(ship.status)}
              size="small"
            />
          </Grid>
        </Grid>

        <Divider sx={{ mb: 3 }} />

        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={handleTabChange}>
            <Tab label="Components" />
            <Tab label="Maintenance History" />
          </Tabs>
        </Box>

        <Box sx={{ mt: 3 }}>
          {activeTab === 0 && (
            <>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                {user.role === 'Admin' && (
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => navigate(`/components/create?shipId=${id}`)}
                  >
                    Add Component
                  </Button>
                )}
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Serial Number</TableCell>
                      <TableCell>Installation Date</TableCell>
                      <TableCell>Last Maintenance</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {ship.components && ship.components.length > 0 ? (
                      ship.components.map((component) => (
                        <TableRow key={component.id}>
                          <TableCell>{component.name}</TableCell>
                          <TableCell>{component.serialNumber}</TableCell>
                          <TableCell>
                            {new Date(component.installationDate).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {component.lastMaintenanceDate
                              ? new Date(component.lastMaintenanceDate).toLocaleDateString()
                              : 'Never'}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={component.status}
                              color={getStatusColor(component.status)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell align="right">
                            <IconButton
                              color="primary"
                              onClick={() => navigate(`/components/${component.id}`)}
                            >
                              <EditIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} align="center">
                          <Typography color="text.secondary">
                            No components for this ship yet.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}

          {activeTab === 1 && (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Performed By</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {ship.maintenanceHistory.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>
                        {new Date(record.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{record.type}</TableCell>
                      <TableCell>{record.description}</TableCell>
                      <TableCell>
                        <Chip
                          label={record.status}
                          color={getStatusColor(record.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{record.performedBy}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default ShipDetailPage; 