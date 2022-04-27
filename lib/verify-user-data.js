// models
const User = require("../models/User");

// verify registry data
async function verifyUserData(username, firstName, lastName, password, takenExceptions = []) {
  let isValid = true;

  // check data exists
  if ((typeof username !== "string" && username !== null) || (typeof firstName !== "string" && firstName !== null) || (typeof lastName !== "string" && lastName !== null) || (typeof password !== "string" && password !== null)) {
    return false;
  }

  // check username status
  if (username !== null && !takenExceptions.includes(username.toLowerCase())) {
    await User.findOne({ username: username.toLowerCase() })
      .then(user => {
        if (user) {
          isValid = false;
        }
      });
  }

  // check username, first name, and last name length
  if ((username.length < 3 && username !== null) || (username.length > 20 && username !== null) || (firstName.length > 20 && firstName !== null) || (lastName.length > 20 && lastName !== null)) {
    console.log("test4")
    isValid = false;
  }

  // check username characters
  if (username !== null) {
    for (let i = 0; i < username.length; i++) {
      if (!"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_".includes(username[i])) {
        console.log("test3")
        isValid = false
      }
    }
  }

  // check password length
  if (password !== null) {
    if (password.length < 8) {
      console.log("test2")
      isValid = false;
    }
  }

  return isValid;
}

// export
module.exports = verifyUserData;