const Group = require("../models/Group");
const Member = require("../models/Member");
const Expense = require("../models/Expense");
class GroupService {
  async createGroup(name, description) {
    return await Group.create({
      name,
      description
    });
  }
  async getGroups() {
    return await Group.find()
      .sort({ createdAt: -1 });
  }
  async getGroup(groupId) {
    const group = await Group.findById(groupId);
    if (!group) {
      throw new Error("Group not found");
    }
    return group;
  }
  async renameGroup(groupId, name) {
    const group = await Group.findByIdAndUpdate(
      groupId,
      { name },
      { new: true, runValidators: true }
    );
    if (!group) {
      throw new Error("Group not found");
    }
    return group;
  }
  async deleteGroup(groupId) {
    const expenses = await Expense.exists({
      groupId
    });
    if (expenses) {
      throw new Error(
        "Cannot delete group containing expenses"
      );
    }
    await Member.deleteMany({
      groupId
    });
    const group = await Group.findByIdAndDelete(groupId);
    if (!group) {
      throw new Error("Group not found");
    }
    return group;
  }
}
module.exports = new GroupService();
