import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,

  useTheme,
  Switch,
} from '@mui/material';

const THEME_KEY = 'appTheme';
const NOTIF_KEY = 'notificationsEnabled';

const SettingsPage = ({ onThemeChange }) => {
  const theme = useTheme();
  const [selectedTheme, setSelectedTheme] = useState('system');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  useEffect(() => {
    const storedTheme = localStorage.getItem(THEME_KEY) || 'system';
    setSelectedTheme(storedTheme);
    const storedNotif = localStorage.getItem(NOTIF_KEY);
    if (storedNotif !== null) {
      setNotificationsEnabled(storedNotif === 'true');
    }
  }, []);

  const handleThemeChange = (event) => {
    const value = event.target.value;
    setSelectedTheme(value);
    localStorage.setItem(THEME_KEY, value);
    if (onThemeChange) {
      onThemeChange(value);
    }
  };

  const handleNotifToggle = (event) => {
    setNotificationsEnabled(event.target.checked);
    localStorage.setItem(NOTIF_KEY, event.target.checked);
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: 500, mx: 'auto' }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
        Settings
      </Typography>
      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Theme
        </Typography>
        <RadioGroup
          value={selectedTheme}
          onChange={handleThemeChange}
          name="theme-selector"
        >
          <FormControlLabel value="light" control={<Radio />} label="Light" />
          <FormControlLabel value="dark" control={<Radio />} label="Dark" />
          <FormControlLabel value="system" control={<Radio />} label="System (Auto)" />
        </RadioGroup>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Your theme preference will be saved and applied across the app.
        </Typography>
      </Paper>
      <Paper sx={{ p: 3, borderRadius: 2, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Notifications
        </Typography>
        <FormControlLabel
          control={<Switch checked={notificationsEnabled} onChange={handleNotifToggle} />}
          label={notificationsEnabled ? 'Enabled' : 'Disabled'}
        />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Toggle in-app notifications on or off.
        </Typography>
      </Paper>
    </Box>
  );
};

export default SettingsPage; 