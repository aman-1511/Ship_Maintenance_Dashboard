import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  useTheme,
  useMediaQuery,
  CircularProgress,
} from '@mui/material';
import {
  DirectionsBoat as ShipIcon,
  Warning as WarningIcon,
  Engineering as JobIcon,
  CheckCircle as CompletedIcon,
} from '@mui/icons-material';
import DashboardCharts from '../components/DashboardCharts';

const DashboardPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalShips: 0,
    overdueMaintenance: 0,
    jobsInProgress: 0,
    completedJobs: 0,
  });
  const [jobs, setJobs] = useState([]);
  const [ships, setShips] = useState([]);
  const [components, setComponents] = useState([]);

  useEffect(() => {
    const fetchData = () => {
      try {
        const storedJobs = JSON.parse(localStorage.getItem('jobs')) || [];
        const storedShips = JSON.parse(localStorage.getItem('ships')) || [];
        const storedComponents = JSON.parse(localStorage.getItem('components')) || [];

        const now = new Date();
        const overdueMaintenance = storedJobs.filter(
          job => job.status === 'Pending' && new Date(job.scheduledDate) < now
        ).length;

        const jobsInProgress = storedJobs.filter(
          job => job.status === 'In Progress'
        ).length;

        const completedJobs = storedJobs.filter(
          job => job.status === 'Completed'
        ).length;

        setStats({
          totalShips: storedShips.length,
          overdueMaintenance,
          jobsInProgress,
          completedJobs,
        });

        setJobs(storedJobs);
        setShips(storedShips);
        setComponents(storedComponents);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <Paper
      sx={{
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Icon sx={{ color, mr: 1, fontSize: 28 }} />
        <Typography variant="h6" component="h2">
          {title}
        </Typography>
      </Box>
      <Typography variant="h4" component="p" sx={{ color }}>
        {value}
      </Typography>
    </Paper>
  );

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Dashboard
      </Typography>

     
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Ships"
            value={stats.totalShips}
            icon={ShipIcon}
            color={theme.palette.primary.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Overdue Maintenance"
            value={stats.overdueMaintenance}
            icon={WarningIcon}
            color={theme.palette.error.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Jobs In Progress"
            value={stats.jobsInProgress}
            icon={JobIcon}
            color={theme.palette.warning.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Completed Jobs"
            value={stats.completedJobs}
            icon={CompletedIcon}
            color={theme.palette.success.main}
          />
        </Grid>
      </Grid>

 
      <DashboardCharts
        jobs={jobs}
        ships={ships}
        components={components}
      />
    </Box>
  );
};

export default DashboardPage; 