// dependencies
const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

// schema
const userSchema = mongoose.Schema({
  username: String,
  displayUsername: String,
  firstName: String,
  lastName: String,
  adminLevel: {
    type: Number,
    default: 0
  },
  dateCreated: {
    type: Date,
    default: Date.now
  },
  notifications: {
    type: [{
      notifType: String,
      notifId: Number
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
  banReason: String,
  banExpiration: Date,
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