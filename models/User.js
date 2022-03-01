// dependencies
const mongoose = require("mongoose");

// schema
const userSchema = mongoose.Schema({
  username: String,
  displayUsername: String,
  dateCreated: {
    type: Date,
    default: Date.now()
  },
  messages: {
    type: [Number],
    defualt: []
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
mongoose.model("Users", userSchema);

// export model
module.exports = UserModel;