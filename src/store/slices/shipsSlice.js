import { createSlice } from '@reduxjs/toolkit';
import { getShips, setShips } from '../../utils/localStorage';

const initialState = {
  ships: getShips() || [],
  loading: false,
  error: null,
};

const shipsSlice = createSlice({
  name: 'ships',
  initialState,
  reducers: {
    fetchShipsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchShipsSuccess: (state, action) => {
      state.loading = false;
      state.ships = action.payload;
      state.error = null;
    },
    fetchShipsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    addShip: (state, action) => {
      state.ships.push(action.payload);
      setShips(state.ships);
    },
    updateShip: (state, action) => {
      const index = state.ships.findIndex((ship) => ship.id === action.payload.id);
      if (index !== -1) {
        state.ships[index] = action.payload;
        setShips(state.ships);
      }
    },
    deleteShip: (state, action) => {
      state.ships = state.ships.filter((ship) => ship.id !== action.payload);
      setShips(state.ships);
    },
  },
});

export const {
  fetchShipsStart,
  fetchShipsSuccess,
  fetchShipsFailure,
  addShip,
  updateShip,
  deleteShip,
} = shipsSlice.actions;


export const fetchShipsFromStorage = () => (dispatch) => {
  dispatch(fetchShipsStart());
  try {
    const ships = getShips();
    dispatch(fetchShipsSuccess(ships));
  } catch (err) {
    dispatch(fetchShipsFailure('Failed to fetch ships from storage'));
  }
};

export default shipsSlice.reducer; 