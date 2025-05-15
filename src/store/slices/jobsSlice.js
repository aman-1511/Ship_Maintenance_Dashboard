import { createSlice } from '@reduxjs/toolkit';
import { getJobs, setJobs } from '../../utils/localStorage';

const initialState = {
  jobs: getJobs() || [],
  loading: false,
  error: null,
};

const jobsSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    fetchJobsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchJobsSuccess: (state, action) => {
      state.loading = false;
      state.jobs = action.payload;
      state.error = null;
    },
    fetchJobsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    addJob: (state, action) => {
      state.jobs.push(action.payload);
      setJobs(state.jobs);
    },
    updateJob: (state, action) => {
      const index = state.jobs.findIndex((job) => job.id === action.payload.id);
      if (index !== -1) {
        state.jobs[index] = action.payload;
        setJobs(state.jobs);
      }
    },
    deleteJob: (state, action) => {
      state.jobs = state.jobs.filter((job) => job.id !== action.payload);
      setJobs(state.jobs);
    },
    updateJobStatus: (state, action) => {
      const { jobId, status } = action.payload;
      const index = state.jobs.findIndex((job) => job.id === jobId);
      if (index !== -1) {
        state.jobs[index].status = status;
        setJobs(state.jobs);
      }
    },
  },
});

export const {
  fetchJobsStart,
  fetchJobsSuccess,
  fetchJobsFailure,
  addJob,
  updateJob,
  deleteJob,
  updateJobStatus,
} = jobsSlice.actions;


export const fetchJobsFromStorage = () => (dispatch) => {
  dispatch(fetchJobsStart());
  try {
    const jobs = getJobs();
    dispatch(fetchJobsSuccess(jobs));
  } catch (err) {
    dispatch(fetchJobsFailure('Failed to fetch jobs from storage'));
  }
};

export default jobsSlice.reducer; 