const municipalities = require('../data/municipalities.json');

const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const isValidPassword = (password) => {
  return password && password.length >= 6;
}

const isAtLeast13YearsOld = (dateOfBirth) => {
  const dob = new Date(dateOfBirth);
  const today = new Date();
  const age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    return age - 1 >= 13;
  }
  return age >= 13;
};

const isValidLocation = (location) => {
  return municipalities.includes(location);
};

module.exports = {
  isValidEmail,
  isValidPassword,
  isAtLeast13YearsOld,
  isValidLocation
};