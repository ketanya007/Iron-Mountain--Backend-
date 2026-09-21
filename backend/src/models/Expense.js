const mongoose = require("mongoose");
const expenseSplitSchema = new mongoose.Schema(
  {
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
      required: true
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    }
  },
  {
    _id: false
  }
);
const expenseSchema = new mongoose.Schema(
  {
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: true,
      index: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    paidBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
      required: true
    },
    splitType: {
      type: String,
      enum: ["EQUAL", "UNEQUAL"],
      required: true
    },
    splits: {
      type: [expenseSplitSchema],
      required: true
    },
    category: {
      type: String,
      enum: [
        "Food",
        "Travel",
        "Hotel",
        "Shopping",
        "Entertainment",
        "Other"
      ],
      required: true
    },
    date: {
      type: Date,
      required: true
    }
  },
  {
    timestamps: true
  }
);
expenseSchema.index({
  groupId: 1,
  category: 1,
  date: -1
});
module.exports = mongoose.model("Expense", expenseSchema);
