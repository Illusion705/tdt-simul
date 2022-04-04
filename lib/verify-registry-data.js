// models
const User = require("../models/User");

// verify registry data
async function verifyRegistryData(username, firstName, lastName, password) {
  let isValid = true;

  // check data exists
  if (!username || !password || !firstName || !lastName) {
    return false;
  }

  // check username status
  await User.findOne({ username: username.toLowerCase() })
    .then(user => {
      if (user) {
        isValid = false;
      }
    });

  // check username, first name, and last name length
  if (username.length < 3 || username.length > 20 || firstName.length > 20 || lastName.length > 20) {
    isValid = false;
  }

  // check username characters
  for (let i = 0; i < username.length; i++) {
    if (!"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_".includes(username[i])) {
      isValid = false
    }
  }

  // check password length
  if (password.length < 8) {
    isValid = false;
  }

  return isValid;
}

// export
module.exports = verifyRegistryData;