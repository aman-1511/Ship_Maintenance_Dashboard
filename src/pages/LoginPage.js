import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  
  Box,
  Typography,
  Button,
  Paper,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { loginStart, loginSuccess, loginFailure } from '../store/slices/authSlice';
import { getUsers, setAuthUser, getAuthUser, initializeLocalStorage } from '../utils/localStorage';
import FormField from '../components/FormField';
import useForm from '../hooks/useForm';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  const [loginError, setLoginError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  // Initialize localStorage on component mount
  useEffect(() => {
    initializeLocalStorage();
  }, []);

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useForm({
    email: '',
    password: '',
  });

  
  useEffect(() => {
    const savedUser = getAuthUser();
    if (savedUser) {
      dispatch(loginSuccess(savedUser));
    }
  }, [dispatch]);

  
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setLoginError(''); 
  };

  const onSubmit = (formValues) => {
    setLoginError(''); 
    dispatch(loginStart());

    
    const users = getUsers();
    

    const user = users.find(
      (u) => u.email === formValues.email && 
             u.password === formValues.password && 
             u.role === selectedRole
    );

    if (user) {
    
      const { password: _, ...userWithoutPassword } = user;
      dispatch(loginSuccess(userWithoutPassword));
      setAuthUser(userWithoutPassword);
    } else {
      const errorMessage = 'Invalid credentials or role mismatch. Please try again.';
      setLoginError(errorMessage);
      dispatch(loginFailure(errorMessage));
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const backgroundStyle = {
    minHeight: '100vh',
    minWidth: '100vw',
    backgroundImage: 'url("/Ship.png")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const glassStyle = {
    background: 'rgba(255, 255, 255, 0.10)',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
    backdropFilter: 'blur(18px)',
    WebkitBackdropFilter: 'blur(18px)',
    borderRadius: '24px',
    border: '1.5px solid rgba(255, 255, 255, 0.25)',
    padding: '40px 32px',
    maxWidth: '400px',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  };

  return (
    <div style={backgroundStyle}>
      <Paper elevation={0} sx={glassStyle}>
        <Typography component="h1" variant="h5" sx={{ mb: 3, fontWeight: 700, letterSpacing: 1 }}>
          Ship Maintenance Dashboard
        </Typography>
        <Box sx={{ width: '100%', mb: 3 }}>
          <FormControl fullWidth>
            <InputLabel>Select Role</InputLabel>
            <Select
              value={selectedRole}
              label="Select Role"
              onChange={(e) => handleRoleSelect(e.target.value)}
              required
            >
              <MenuItem value="Admin">Admin</MenuItem>
              <MenuItem value="Inspector">Inspector</MenuItem>
              <MenuItem value="Engineer">Engineer</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1, width: '100%' }}>
          {(error || loginError) && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error || loginError}
            </Alert>
          )}
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormField
                name="email"
                label="Email Address"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                touched={touched.email}
                error={errors.email}
                required
                autoFocus
                autoComplete="email"
                disabled={loading}
                sx={{
                  background: 'rgba(255,255,255,0.15)',
                  borderRadius: '8px',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255,255,255,0.25)',
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormField
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                touched={touched.password}
                error={errors.password}
                required
                autoComplete="current-password"
                disabled={loading}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={togglePasswordVisibility}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  background: 'rgba(255,255,255,0.15)',
                  borderRadius: '8px',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255,255,255,0.25)',
                }}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, fontWeight: 600, fontSize: '1.1rem', py: 1.2, borderRadius: '12px' }}
            disabled={loading || !selectedRole}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Sign In'
            )}
          </Button>
        </Box>
      </Paper>
    </div>
  );
};

export default LoginPage; 