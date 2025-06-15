import * as Yup from 'yup';

export const loginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

export const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
});

export const signupSchema = Yup.object().shape({
  first_name: Yup.string().required('First name is required'),
  last_name: Yup.string().required('Last name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters long'),
});

export const changePasswordSchema = Yup.object().shape({
  currentPassword: Yup.string()
    .required('Current Password is required')
    .min(8, 'Password must be at least 8 characters long'),
  newPassword: Yup.string()
    .required('New Password is required')
    .min(8, 'New Password must be at least 8 characters long'),
});

export const resetPasswordSchema = Yup.object().shape({
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm Password is required'),
  password: Yup.string()
    .required('New Password is required')
    .min(8, 'Password must be at least 8 characters long'),
});

export const userSchema = Yup.object().shape({
  first_name: Yup.string().required('First name is required'),
  last_name: Yup.string().required('Last name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  status: Yup.boolean(),
  language: Yup.string().required('Language is required'),
});
