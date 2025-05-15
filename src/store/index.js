import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import shipsReducer from './slices/shipsSlice';
import componentsReducer from './slices/componentsSlice';
import jobsReducer from './slices/jobsSlice';
import notificationsReducer from './slices/notificationsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ships: shipsReducer,
    components: componentsReducer,
    jobs: jobsReducer,
    notifications: notificationsReducer,
  },
});

export default store; 