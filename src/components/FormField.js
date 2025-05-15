import React from 'react';
import { TextField } from '@mui/material';
import { validateField } from '../utils/validation';

const glassInputSx = {
  background: 'rgba(255,255,255,0.15)',
  borderRadius: '8px',
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
  border: '1px solid rgba(255,255,255,0.25)',
  color: '#222',
  transition: 'background 0.2s',
  '&.Mui-focused': {
    background: 'rgba(255,255,255,0.18)',
  },
  '&:hover': {
    background: 'rgba(255,255,255,0.18)',
  },
};

const FormField = ({
  name,
  label,
  value,
  onChange,
  onBlur,
  type = 'text',
  required = false,
  disabled = false,
  touched = false,
  error = '',
  validationRules = [],
  fullWidth = true,
  multiline = false,
  rows = 1,
  InputProps = {},
  ...props
}) => {
  const handleChange = (e) => {
    const { value } = e.target;
    onChange(e);
    
    // Validate on change if field has been touched
    if (touched && validationRules.length > 0) {
      const validationError = validateField(value, validationRules);
      onBlur({ target: { name, value, error: validationError } });
    }
  };

  const handleBlur = (e) => {
    const { value } = e.target;
    const validationError = validateField(value, validationRules);
    onBlur({ target: { name, value, error: validationError } });
  };

  // Merge glass effect with any InputProps.sx passed in
  const mergedInputProps = {
    ...InputProps,
    sx: { ...glassInputSx, ...(InputProps.sx || {}) },
  };

  return (
    <TextField
      name={name}
      label={label}
      value={value}
      onChange={handleChange}
      onBlur={handleBlur}
      type={type}
      required={required}
      disabled={disabled}
      error={touched && !!error}
      helperText={touched && error}
      fullWidth={fullWidth}
      multiline={multiline}
      rows={rows}
      InputProps={mergedInputProps}
      {...props}
    />
  );
};

export default FormField; 