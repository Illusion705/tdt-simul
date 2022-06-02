// dependencies
const mongoose = require("mongoose");

// schema
const messageSchema = mongoose.Schema({
  
});

// model
const Message = mongoose.model("Messages", messageSchema);

// export model
module.exports = Message;