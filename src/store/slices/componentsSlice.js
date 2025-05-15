import { createSlice } from '@reduxjs/toolkit';
import { getComponents, setComponents } from '../../utils/localStorage';

const initialState = {
  components: [],
  loading: false,
  error: null,
};

const componentsSlice = createSlice({
  name: 'components',
  initialState,
  reducers: {
    fetchComponentsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchComponentsSuccess: (state, action) => {
      state.loading = false;
      state.components = action.payload;
      state.error = null;
    },
    fetchComponentsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    addComponent: (state, action) => {
      state.components.push(action.payload);
      setComponents(action.payload.shipId, state.components.filter(c => c.shipId === action.payload.shipId));
    },
    updateComponent: (state, action) => {
      const index = state.components.findIndex((c) => c.id === action.payload.id);
      if (index !== -1) {
        state.components[index] = action.payload;
        setComponents(action.payload.shipId, state.components.filter(c => c.shipId === action.payload.shipId));
      }
    },
    deleteComponent: (state, action) => {
      state.components = state.components.filter((c) => c.id !== action.payload.id);
      setComponents(action.payload.shipId, state.components.filter(c => c.shipId === action.payload.shipId));
    },
  },
});

export const {
  fetchComponentsStart,
  fetchComponentsSuccess,
  fetchComponentsFailure,
  addComponent,
  updateComponent,
  deleteComponent,
} = componentsSlice.actions;


export const fetchComponentsFromStorage = (shipId) => (dispatch) => {
  dispatch(fetchComponentsStart());
  try {
    const components = getComponents(shipId);
    dispatch(fetchComponentsSuccess(components));
  } catch (err) {
    dispatch(fetchComponentsFailure('Failed to fetch components from storage'));
  }
};

export default componentsSlice.reducer; 