const Member = require("../models/Member");
const Expense = require("../models/Expense");
class MemberService {
  async addMember(groupId, name) {
    return await Member.create({
      groupId,
      name
    });
  }
  async getMembers(groupId) {
    return await Member.find({
      groupId
    }).sort({
      name: 1
    });
  }
  async renameMember(memberId, name) {
    const member = await Member.findByIdAndUpdate(
      memberId,
      { name },
      {
        new: true,
        runValidators: true
      }
    );
    if (!member) {
      throw new Error("Member not found");
    }
    return member;
  }
  async removeMember(groupId, memberId) {
    const member = await Member.findOne({
      _id: memberId,
      groupId
    });
    if (!member) {
      throw new Error("Member not found in this group");
    }
    // Important business rule
    const usedInExpense = await Expense.exists({
      groupId,
      "splits.memberId": memberId
    });
    const paidExpense = await Expense.exists({
      groupId,
      paidBy: memberId
    });
    if (usedInExpense || paidExpense) {
      throw new Error(
        "Member cannot be removed because they are associated with an expense"
      );
    }
    await Member.deleteOne({
      _id: memberId,
      groupId
    });
    return {
      message: "Member removed successfully"
    };
  }
}
module.exports = new MemberService();
