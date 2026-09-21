const BalanceService = require("./balance.service");
const Settlement = require("../models/Settlement");
const Member = require("../models/Member");
class SettlementService {
  async getSuggestions(groupId) {
    const balances =
      await BalanceService.calculateBalances(groupId);
    const creditors = [];
    const debtors = [];
    for (const member of balances) {
      if (member.balance > 0) {
        creditors.push({
          ...member
        });
      }
      if (member.balance < 0) {
        debtors.push({
          ...member,
          balance: Math.abs(member.balance)
        });
      }
    }
    // Largest amounts first
    creditors.sort(
      (a, b) => b.balance - a.balance
    );
    debtors.sort(
      (a, b) => b.balance - a.balance
    );
    const suggestions = [];
    let i = 0;
    let j = 0;
    while (
      i < debtors.length &&
      j < creditors.length
    ) {
      const debtor = debtors[i];
      const creditor = creditors[j];
      const amount = Math.min(
        debtor.balance,
        creditor.balance
      );
      suggestions.push({
        from: {
          memberId: debtor.memberId,
          name: debtor.name
        },
        to: {
          memberId: creditor.memberId,
          name: creditor.name
        },
        amount
      });
      debtor.balance -= amount;
      creditor.balance -= amount;
      if (debtor.balance < 0.01) {
        i++;
      }
      if (creditor.balance < 0.01) {
        j++;
      }
    }
    return suggestions;
  }
  async createSettlement(
    groupId,
    fromMember,
    toMember,
    amount
  ) {
    if (amount <= 0) {
      throw new Error(
        "Settlement amount must be greater than zero"
      );
    }
    if (
      fromMember.toString() ===
      toMember.toString()
    ) {
      throw new Error(
        "A member cannot settle with themselves"
      );
    }
    const members = await Member.find({
      _id: {
        $in: [fromMember, toMember]
      },
      groupId
    });
    if (members.length !== 2) {
      throw new Error(
        "Both members must belong to the group"
      );
    }
    return await Settlement.create({
      groupId,
      fromMember,
      toMember,
      amount
    });
  }
  async getHistory(groupId) {
    return await Settlement.find({
      groupId
    })
      .populate("fromMember", "name")
      .populate("toMember", "name")
      .sort({
        date: -1
      });
  }
}
module.exports = new SettlementService();
