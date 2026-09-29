/**
 * Validator functions for authentication requests
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateRegister(req) {
  const errors = [];
  const { name, email, password, confirmPassword } = req.body || {};

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    errors.push('Name is required and must be at least 2 characters long.');
  } else if (name.trim().length > 100) {
    errors.push('Name cannot exceed 100 characters.');
  }

  if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
    errors.push('A valid email address is required.');
  }

  if (!password || typeof password !== 'string' || password.length < 8) {
    errors.push('Password must be at least 8 characters long.');
  } else if (!/(?=.*[a-zA-Z])(?=.*[0-9])/.test(password)) {
    errors.push('Password must contain at least one letter and one number.');
  }

  if (password !== confirmPassword) {
    errors.push('Password and confirm password do not match.');
  }

  return errors;
}

function validateLogin(req) {
  const errors = [];
  const { email, password } = req.body || {};

  if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
    errors.push('A valid email address is required.');
  }

  if (!password || typeof password !== 'string' || password.length === 0) {
    errors.push('Password is required.');
  }

  return errors;
}

function validateChangePassword(req) {
  const errors = [];
  const { currentPassword, newPassword, confirmPassword } = req.body || {};

  if (!currentPassword || typeof currentPassword !== 'string') {
    errors.push('Current password is required.');
  }

  if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 8) {
    errors.push('New password must be at least 8 characters long.');
  } else if (!/(?=.*[a-zA-Z])(?=.*[0-9])/.test(newPassword)) {
    errors.push('New password must contain at least one letter and one number.');
  }

  if (newPassword === currentPassword) {
    errors.push('New password cannot be the same as the current password.');
  }

  if (newPassword !== confirmPassword) {
    errors.push('New password and confirm password do not match.');
  }

  return errors;
}

module.exports = {
  validateRegister,
  validateLogin,
  validateChangePassword
};
