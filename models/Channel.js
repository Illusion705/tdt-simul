// dependencies
const mongoose = require("mongoose");

// schema
const channelSchema = mongoose.Schema({
  name: String,
  order: Number,
  messages: {
    type: [Number],
    default: []
  },
  canSee: {
    type: Number,
    default: 0
  },
  canPost: {
    type: Number,
    default: 0
  }
});

// model
const Channel = mongoose.model("Channels", channelSchema);

// export model
module.exports = Channel;