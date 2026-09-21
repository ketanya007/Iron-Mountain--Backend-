const groupService = require("../services/group.service");
exports.create = async (req, res) => {
  try {
    const group =
      await groupService.createGroup(
        req.body.name,
        req.body.description
      );
    res.status(201).json(group);
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
};
exports.getAll = async (req, res) => {
  try {
    const groups =
      await groupService.getGroups();
    res.json(groups);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};
exports.getOne = async (req, res) => {
  try {
    const group =
      await groupService.getGroup(
        req.params.groupId
      );
    res.json(group);
  } catch (error) {
    res.status(404).json({
      message: error.message
    });
  }
};
exports.rename = async (req, res) => {
  try {
    const group =
      await groupService.renameGroup(
        req.params.groupId,
        req.body.name
      );
    res.json(group);
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
};
exports.remove = async (req, res) => {
  try {
    await groupService.deleteGroup(
      req.params.groupId
    );
    res.json({
      message: "Group deleted"
    });
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
};
