// dependencies
const mongoose = require("mongoose");

// schema
const userSchema = mongoose.Schema({
  username: String,
  displayUsername: String,
  isAdmin: {
    type: Boolean,
    default: false
  },
  dateCreated: {
    type: Date,
    default: Date.now()
  },
  messages: {
    type: [Number],
    defualt: []
  },
  notifications: {
    type: [{
      type: String,
      id: Number
    }],
    default: []
  },
  isBanned: {
    type: Boolean,
    default: false
  },
  banReason: {
    type: String,
    default: null
  },
  banExpiration: {
    type: Date,
    default: null
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  isVerified: {
    type: Boolean,
    default: false
  }
});

// create model
const Users = mongoose.model("Users", userSchema);

// export model
module.exports = Users;