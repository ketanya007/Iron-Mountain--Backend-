const mongoose = require("mongoose");
const groupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);
module.exports = mongoose.model("Group", groupSchema);
