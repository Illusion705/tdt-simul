// models
const User = require("../models/User");
const Alert = require("../models/Alert");

// create alert
async function createAlert(message, username) {
  // generate id
  let id;
  while (true) {
    id = Math.floor(Math.random() * (999999999 - 100000000 + 1) + 100000000);

    Alert.findOne({ id: id })
      .then(alert => {
        if (alert) {
          id = null;
        }
      });

    if (id) {
      break;
    }
  }

  // create alert
  const alert = new Alert({
    id: id,
    message: message
  });

  await alert.save();

  // add alert to user
  return await User.findOne({ username: username })
    .then(async user => {
      if (user) {
        user.notifications.push({
          notifType: "alert",
          id: id
        });
  
        await user.save();

        return "success";
      } else {
        return "no user found";
      }
  });
}

// export
module.exports = createAlert;