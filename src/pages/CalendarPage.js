import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Paper,
  Typography,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  IconButton,
  
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  
  Error as ErrorIcon,
  Schedule as ScheduleIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format, isSameDay } from 'date-fns';
import { fetchJobsFromStorage } from '../store/slices/jobsSlice';
import { getShips } from '../utils/localStorage';

const getStatusColor = (status) => {
  switch (status) {
    case 'Completed':
      return 'success';
    case 'In Progress':
      return 'info';
    case 'Cancelled':
      return 'error';
    default:
      return 'warning';
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case 'Completed':
      return <CheckCircleIcon />;
    case 'In Progress':
      return <ScheduleIcon />;
    case 'Cancelled':
      return <ErrorIcon />;
    default:
      return <ScheduleIcon />;
  }
};

const CalendarPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedJobs, setSelectedJobs] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const jobs = useSelector((state) => state.jobs.jobs);
  const [ships, setShips] = useState([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await dispatch(fetchJobsFromStorage());
      setShips(getShips());
      setLoading(false);
    };
    loadData();
  }, [dispatch]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    const jobsForDate = jobs.filter(job => 
      isSameDay(new Date(job.scheduledDate), date)
    );
    setSelectedJobs(jobsForDate);
    if (jobsForDate.length > 0) {
      setDialogOpen(true);
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const getShipName = (shipId) => {
    const ship = ships.find((s) => s.id === shipId);
    return ship ? ship.name : 'Unknown';
  };

  const getJobCountForDate = (date) => {
    return jobs.filter(job => 
      isSameDay(new Date(job.scheduledDate), date)
    ).length;
  };

  const renderDayContent = (day) => {
    const jobCount = getJobCountForDate(day);
    return (
      <Box sx={{ position: 'relative', height: '100%' }}>
        <Typography>{format(day, 'd')}</Typography>
        {jobCount > 0 && (
          <Chip
            label={jobCount}
            size="small"
            color="primary"
            sx={{
              position: 'absolute',
              top: -8,
              right: -8,
              height: 20,
              minWidth: 20,
              fontSize: '0.75rem',
            }}
          />
        )}
      </Box>
    );
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
        Maintenance Calendar
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, borderRadius: 2 }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateCalendar
                value={selectedDate}
                onChange={handleDateChange}
                renderDay={(day, selectedDays, pickersDayProps) => (
                  <Box
                    {...pickersDayProps}
                    sx={{
                      position: 'relative',
                      '& .MuiPickersDay-root': {
                        height: 36,
                        width: 36,
                      },
                    }}
                  >
                    {renderDayContent(day)}
                  </Box>
                )}
                sx={{
                  width: '100%',
                  '& .MuiPickersCalendarHeader-root': {
                    marginTop: 1,
                  },
                }}
              />
            </LocalizationProvider>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, borderRadius: 2, height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Upcoming Maintenance
            </Typography>
            {jobs
              .filter(job => new Date(job.scheduledDate) > new Date())
              .sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate))
              .slice(0, 5)
              .map(job => (
                <Box
                  key={job.id}
                  sx={{
                    p: 1.5,
                    mb: 1,
                    borderRadius: 1,
                    bgcolor: 'background.default',
                    '&:hover': {
                      bgcolor: 'action.hover',
                      cursor: 'pointer',
                    },
                  }}
                  onClick={() => {
                    setSelectedDate(new Date(job.scheduledDate));
                    setSelectedJobs([job]);
                    setDialogOpen(true);
                  }}
                >
                  <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                    {job.type}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip
                      size="small"
                      label={job.status}
                      color={getStatusColor(job.status)}
                      icon={getStatusIcon(job.status)}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {format(new Date(job.scheduledDate), 'MMM dd, yyyy')}
                    </Typography>
                  </Box>
                </Box>
              ))}
          </Paper>
        </Grid>
      </Grid>

      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
          },
        }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">
              Jobs for {format(selectedDate, 'MMMM dd, yyyy')}
            </Typography>
            <IconButton onClick={handleCloseDialog} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedJobs.length > 0 ? (
            <Box sx={{ mt: 1 }}>
              {selectedJobs.map(job => (
                <Paper
                  key={job.id}
                  sx={{
                    p: 2,
                    mb: 2,
                    borderRadius: 1,
                    bgcolor: 'background.default',
                  }}
                >
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>
                    {job.type}
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Ship
                      </Typography>
                      <Typography variant="body1">
                        {getShipName(job.shipId)}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Status
                      </Typography>
                      <Chip
                        size="small"
                        label={job.status}
                        color={getStatusColor(job.status)}
                        icon={getStatusIcon(job.status)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Priority
                      </Typography>
                      <Chip
                        size="small"
                        label={job.priority}
                        color={
                          job.priority === 'High' || job.priority === 'Critical'
                            ? 'error'
                            : job.priority === 'Medium'
                            ? 'warning'
                            : 'default'
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Scheduled Time
                      </Typography>
                      <Typography variant="body1">
                        {format(new Date(job.scheduledDate), 'hh:mm a')}
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>
              ))}
            </Box>
          ) : (
            <Typography color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
              No jobs scheduled for this date
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CalendarPage; 