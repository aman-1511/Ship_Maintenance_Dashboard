import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Container,
  Paper,
  Typography,
  Button,
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
  Box,
  Chip,
  TextField,
  InputAdornment,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { deleteShip, fetchShipsFromStorage } from '../store/slices/shipsSlice';

const ShipsPage = () => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [shipToDelete, setShipToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const ships = useSelector((state) => state.ships.ships);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const loadShips = async () => {
      setLoading(true);
      await dispatch(fetchShipsFromStorage());
      setLoading(false);
    };
    loadShips();
  }, [dispatch]);

  const filteredShips = ships.filter(ship =>
    ship.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ship.imoNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ship.flag.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreate = () => {
    navigate('/ships/create');
  };

  const handleEdit = (id) => {
    navigate(`/ships/${id}/edit`);
  };

  const handleView = (id) => {
    navigate(`/ships/${id}`);
  };

  const handleDeleteClick = (ship) => {
    setShipToDelete(ship);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (shipToDelete) {
      dispatch(deleteShip(shipToDelete.id));
      dispatch(fetchShipsFromStorage());
      setDeleteDialogOpen(false);
      setShipToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setShipToDelete(null);
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
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', mb: 3, gap: 2 }}>
        <Typography variant="h4" component="h1">
          Ships Management
        </Typography>
        {user?.role === 'Admin' && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreate}
            sx={{ width: { xs: '100%', sm: 'auto' } }}
          >
            Add New Ship
          </Button>
        )}
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search ships by name, IMO number, or flag..."
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
      </Paper>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>IMO Number</TableCell>
                <TableCell>Flag</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredShips.length > 0 ? (
                filteredShips.map((ship) => (
                  <TableRow key={ship.id}>
                    <TableCell>{ship.name}</TableCell>
                    <TableCell>{ship.imoNumber}</TableCell>
                    <TableCell>{ship.flag}</TableCell>
                    <TableCell>
                      <Chip
                        label={ship.status}
                        color={getStatusColor(ship.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        color="primary"
                        onClick={() => handleView(ship.id)}
                        title="View Details"
                      >
                        <ViewIcon />
                      </IconButton>
                      {user?.role === 'Admin' && (
                        <>
                          <IconButton
                            color="primary"
                            onClick={() => handleEdit(ship.id)}
                            title="Edit Ship"
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={() => handleDeleteClick(ship)}
                            title="Delete Ship"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                    <Typography color="text.secondary">
                      {searchQuery ? 'No ships found matching your search' : 'No ships available'}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete the ship "{shipToDelete?.name}"?
          This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          {user?.role === 'Admin' && (
            <Button onClick={handleDeleteConfirm} color="error">
              Delete
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ShipsPage; 