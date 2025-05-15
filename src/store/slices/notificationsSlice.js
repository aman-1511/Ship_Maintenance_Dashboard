import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action) => {
      state.items.push({
        id: Date.now(),
        ...action.payload,
        read: false,
      });
    },
    markAsRead: (state, action) => {
      const notification = state.items.find(
        (item) => item.id === action.payload
      );
      if (notification) {
        notification.read = true;
      }
    },
    removeNotification: (state, action) => {
      state.items = state.items.filter(
        (item) => item.id !== action.payload
      );
    },
    clearAllNotifications: (state) => {
      state.items = [];
    },
  },
});

export const {
  addNotification,
  markAsRead,
  removeNotification,
  clearAllNotifications,
} = notificationsSlice.actions;

export const createJobNotification = (type, job) => {
  let title = '';
  let message = '';
  if (type === 'created') {
    title = 'Job Created';
    message = `Job "${job.type}" for ship ${job.shipId} was created.`;
  } else if (type === 'updated') {
    title = 'Job Updated';
    message = `Job "${job.type}" for ship ${job.shipId} was updated.`;
  } else if (type === 'completed') {
    title = 'Job Completed';
    message = `Job "${job.type}" for ship ${job.shipId} was completed.`;
  }
  return { title, message, timestamp: Date.now() };
};

export default notificationsSlice.reducer; 