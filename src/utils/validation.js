export const rules = {
  required: (value) => !!value || 'This field is required',
  email: (value) => {
    const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return !value || pattern.test(value) || 'Invalid email address';
  },
  minLength: (min) => (value) => 
    !value || value.length >= min || `Minimum length is ${min} characters`,
  maxLength: (max) => (value) => 
    !value || value.length <= max || `Maximum length is ${max} characters`,
  password: (value) => {
    const pattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
    return !value || pattern.test(value) || 
      'Password must be at least 8 characters and contain both letters and numbers';
  },
  imo: (value) => {
    const pattern = /^[A-Z]{2}\d{7}$/;
    return !value || pattern.test(value) || 'Invalid IMO number format (e.g., AB1234567)';
  },
  date: (value) => {
    const date = new Date(value);
    return !value || (!isNaN(date) && date instanceof Date) || 'Invalid date format';
  },
  futureDate: (value) => {
    const date = new Date(value);
    const today = new Date();
    return !value || date > today || 'Date must be in the future';
  },
};


export const validateForm = (values, validationRules) => {
  const errors = {};
  
  Object.keys(validationRules).forEach((field) => {
    const fieldRules = validationRules[field];
    const value = values[field];
    
    if (Array.isArray(fieldRules)) {
      for (const rule of fieldRules) {
        const error = rule(value);
        if (error) {
          errors[field] = error;
          break;
        }
      }
    } else {
      const error = fieldRules(value);
      if (error) {
        errors[field] = error;
      }
    }
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};


export const validateField = (value, rules) => {
  if (Array.isArray(rules)) {
    for (const rule of rules) {
      const error = rule(value);
      if (error) return error;
    }
  } else {
    return rules(value);
  }
  return '';
}; 