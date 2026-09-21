const memberService =
  require("../services/member.service");
exports.add = async (req, res) => {
  try {
    const member =
      await memberService.addMember(
        req.params.groupId,
        req.body.name
      );
    res.status(201).json(member);
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
};
exports.getAll = async (req, res) => {
  try {
    const members =
      await memberService.getMembers(
        req.params.groupId
      );
    res.json(members);
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
};
exports.rename = async (req, res) => {
  try {
    const member =
      await memberService.renameMember(
        req.params.memberId,
        req.body.name
      );
    res.json(member);
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
};
exports.remove = async (req, res) => {
  try {
    const result =
      await memberService.removeMember(
        req.params.groupId,
        req.params.memberId
      );
    res.json(result);
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
};
