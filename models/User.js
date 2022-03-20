// dependencies
const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

// schema
const userSchema = mongoose.Schema({
  username: String,
  displayUsername: String,
  firstName: String,
  lastName: String,
  password: String,
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
  notificationCount: {
    type: Number,
    default: 0
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
  verificationStatus: {
    type: String,
    default: "pending"
  },
  defaultIconColor: String
});

// plugins
userSchema.plugin(passportLocalMongoose);

// model
const User = mongoose.model("Users", userSchema);

// export model
module.exports = User;