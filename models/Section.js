// dependencies
const mongoose = require("mongoose");

// schema
const sectionSchema = mongoose.Schema({
  name: String,
  sectionId: Number,
  order: Number,
  channels: {
    type: [Number],
    default: []
  },
  canSee: {
    type: Number,
    default: 0
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
});

// model
const Section = mongoose.model("Sections", sectionSchema);

// export model
module.exports = Section;