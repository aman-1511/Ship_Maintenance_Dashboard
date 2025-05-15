import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Search as SearchIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { fetchComponentsFromStorage, deleteComponent } from '../store/slices/componentsSlice';
import { getShips } from '../utils/localStorage';

const ComponentsPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const components = useSelector((state) => state.components.components);
  const [ships, setShips] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredComponents, setFilteredComponents] = useState([]);

  useEffect(() => {
    setShips(getShips());
    
    if (ships.length > 0) {
      dispatch(fetchComponentsFromStorage(ships[0].id));
    }
  }, [dispatch, ships.length]);

  useEffect(() => {
 
    const filtered = components.filter(component =>
      component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      component.serialNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredComponents(filtered);
  }, [searchTerm, components]);

  const handleCreate = () => {
    navigate('/components/create');
  };

  const handleEdit = (shipId, componentId) => {
    navigate(`/components/${componentId}?shipId=${shipId}`);
  };

  const handleDelete = (shipId, componentId) => {
    dispatch(deleteComponent({ shipId, id: componentId }));
    dispatch(fetchComponentsFromStorage(shipId));
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

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Components
        </Typography>
        {user?.role === 'Admin' && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreate}
          >
            Add Component
          </Button>
        )}
      </Box>

      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search by component name or serial number"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Component Name</TableCell>
              <TableCell>Serial Number</TableCell>
              <TableCell>Ship</TableCell>
              <TableCell>Installation Date</TableCell>
              <TableCell>Last Maintenance</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredComponents.map((component) => (
              <TableRow key={component.id}>
                <TableCell>{component.name}</TableCell>
                <TableCell>{component.serialNumber}</TableCell>
                <TableCell>{ships.find(s => s.id === component.shipId)?.name || 'Unknown'}</TableCell>
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
                  {user?.role === 'Admin' && (
                    <>
                      <IconButton color="primary" onClick={() => handleEdit(component.shipId, component.id)} title="Edit Component">
                        <EditIcon />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDelete(component.shipId, component.id)} title="Delete Component">
                        <DeleteIcon />
                      </IconButton>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default ComponentsPage; 