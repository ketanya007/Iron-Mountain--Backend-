const Expense = require("../models/Expense");
const Settlement = require("../models/Settlement");
const Member = require("../models/Member");
class BalanceService {
  async calculateBalances(groupId) {
    const members = await Member.find({
      groupId
    });
    const expenses = await Expense.find({
      groupId
    });
    const settlements = await Settlement.find({
      groupId
    });
    const balance = {};
    // Initialize
    for (const member of members) {
      balance[member._id.toString()] = 0;
    }
    // Expenses
    for (const expense of expenses) {
      const payer = expense.paidBy.toString();
      // Person who paid gets credit
      balance[payer] += expense.amount;
      // Every participant gets debit
      for (const split of expense.splits) {
        const memberId =
          split.memberId.toString();
        balance[memberId] -= split.amount;
      }
    }
    // Settlements
    for (const settlement of settlements) {
      const from =
        settlement.fromMember.toString();
      const to =
        settlement.toMember.toString();
      // Debtor paid creditor
      balance[from] += settlement.amount;
      balance[to] -= settlement.amount;
    }
    return members.map(member => {
      const value =
        Math.round(
          balance[member._id.toString()] * 100
        ) / 100;
      return {
        memberId: member._id,
        name: member.name,
        balance: value,
        status:
          value > 0
            ? "GETS"
            : value < 0
              ? "OWES"
              : "SETTLED"
      };
    });
  }
}
module.exports = new BalanceService();
