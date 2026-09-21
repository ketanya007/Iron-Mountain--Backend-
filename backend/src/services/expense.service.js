const Expense = require("../models/Expense");
const Member = require("../models/Member");
class ExpenseService {
  async validateMembers(groupId, paidBy, splits) {
    const memberIds = [
      paidBy,
      ...splits.map(s => s.memberId)
    ];
    const uniqueIds = [
      ...new Set(memberIds.map(id => id.toString()))
    ];
    const members = await Member.find({
      groupId,
      _id: { $in: uniqueIds }
    });
    if (members.length !== uniqueIds.length) {
      throw new Error(
        "All members must belong to the group"
      );
    }
  }
  validateSplits(amount, splitType, splits) {
    if (!splits || splits.length === 0) {
      throw new Error("At least one split is required");
    }
    if (splitType === "EQUAL") {
      const share = amount / splits.length;
      for (const split of splits) {
        if (Math.abs(split.amount - share) > 0.01) {
          throw new Error(
            "Equal split amounts are invalid"
          );
        }
      }
    } else {
      const total = splits.reduce(
        (sum, split) => sum + split.amount,
        0
      );
      if (Math.abs(total - amount) > 0.01) {
        throw new Error(
          "Sum of all shares must equal expense amount"
        );
      }
    }
  }
  async createExpense(data) {
    const {
      groupId,
      description,
      amount,
      paidBy,
      splitType,
      splits,
      category,
      date
    } = data;
    if (amount <= 0) {
      throw new Error(
        "Expense amount must be greater than zero"
      );
    }
    await this.validateMembers(
      groupId,
      paidBy,
      splits
    );
    this.validateSplits(
      amount,
      splitType,
      splits
    );
    return await Expense.create({
      groupId,
      description,
      amount,
      paidBy,
      splitType,
      splits,
      category,
      date
    });
  }
  async getExpenses(groupId, query) {
    const {
      search,
      category,
      paidBy,
      from,
      to,
      sortBy = "date",
      order = "desc"
    } = query;
    const filter = {
      groupId
    };
    // Search
    if (search) {
      filter.description = {
        $regex: search,
        $options: "i"
      };
    }
    // Category filter
    if (category) {
      filter.category = category;
    }
    // Paid-by filter
    if (paidBy) {
      filter.paidBy = paidBy;
    }
    // Date filtering
    if (from || to) {
      filter.date = {};
      if (from) {
        filter.date.$gte = new Date(from);
      }
      if (to) {
        filter.date.$lte = new Date(to);
      }
    }
    const allowedSortFields = [
      "date",
      "amount",
      "description"
    ];
    const field = allowedSortFields.includes(sortBy)
      ? sortBy
      : "date";
    const sort = {
      [field]: order === "asc" ? 1 : -1
    };
    return await Expense.find(filter)
      .populate("paidBy", "name")
      .populate("splits.memberId", "name")
      .sort(sort);
  }
  async getExpense(groupId, expenseId) {
    const expense = await Expense.findOne({
      _id: expenseId,
      groupId
    })
      .populate("paidBy", "name")
      .populate("splits.memberId", "name");
    if (!expense) {
      throw new Error("Expense not found");
    }
    return expense;
  }
  async updateExpense(groupId, expenseId, data) {
    const existing = await Expense.findOne({
      _id: expenseId,
      groupId
    });
    if (!existing) {
      throw new Error("Expense not found");
    }
    const updated = {
      ...existing.toObject(),
      ...data
    };
    await this.validateMembers(
      groupId,
      updated.paidBy,
      updated.splits
    );
    this.validateSplits(
      updated.amount,
      updated.splitType,
      updated.splits
    );
    Object.assign(existing, data);
    return await existing.save();
  }
  async deleteExpense(groupId, expenseId) {
    const result = await Expense.deleteOne({
      _id: expenseId,
      groupId
    });
    if (result.deletedCount === 0) {
      throw new Error("Expense not found");
    }
    return {
      message: "Expense deleted successfully"
    };
  }
}
module.exports = new ExpenseService();
