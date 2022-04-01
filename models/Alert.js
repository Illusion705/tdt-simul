// dependencies
const mongoose = require("mongoose");

// schema
const alertSchema = mongoose.Schema({
  id: Number,
  date: {
    type: Date,
    default: Date.now()
  },
  message: String,
  isSeen: {
    type: Boolean,
    default: false
  },
  isUserConfirmed: {
    type: Boolean,
    default: false
  }
});

// model
const Alert = mongoose.model("Alerts", alertSchema);

// export model
module.exports = Alert;