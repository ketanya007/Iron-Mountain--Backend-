const mongoose = require("mongoose");
const settlementSchema = new mongoose.Schema(
  {
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: true,
      index: true
    },
    fromMember: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
      required: true
    },
    toMember: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
      required: true
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    date: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);
module.exports = mongoose.model("Settlement", settlementSchema);
