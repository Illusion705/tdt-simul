// dependencies
const mongoose = require("mongoose");

// schema
const sectionSchema = mongoose.Schema({
  name: String,
  order: Number,
  channels: {
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
const Section = mongoose.model("Sections", sectionSchema);

// export model
module.exports = Section;