// dependencies
const mongoose = require("mongoose");

// schema
const unbanRequestSchema = new mongoose.Schema({
  username: String,
  date: {
    type: Date,
    default: Date.now
  },
  message: String,
  status: {
    type: String,
    default: "pending"
  }
});

// model
const UnbanRequest = mongoose.model("UnbanRequests", unbanRequestSchema);

// export model
module.exports = UnbanRequest;