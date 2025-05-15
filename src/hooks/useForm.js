import { useState, useCallback } from 'react';
import { validateForm } from '../utils/validation';

const useForm = (initialValues = {}, validationRules = {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setValues(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const handleBlur = useCallback((e) => {
    const { name, value, error } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    
    if (error !== undefined) {
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  }, []);

  const handleSubmit = useCallback((onSubmit) => (e) => {
    e.preventDefault();
    
   
    const allTouched = Object.keys(values).reduce((acc, key) => ({
      ...acc,
      [key]: true
    }), {});
    setTouched(allTouched);
    

    const { isValid, errors: validationErrors } = validateForm(values, validationRules);
    setErrors(validationErrors);
    
    if (isValid) {
      onSubmit(values);
    }
  }, [values, validationRules]);

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  const setFieldValue = useCallback((name, value) => {
    setValues(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const setFieldError = useCallback((name, error) => {
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  }, []);

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFieldValue,
    setFieldError,
    setValues,
    setErrors,
    setTouched,
  };
};

export default useForm; 