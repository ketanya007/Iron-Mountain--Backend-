const router = require("express").Router();
const controller =
  require("../controllers/member.controller");
router.post(
  "/:groupId/members",
  controller.add
);
router.get(
  "/:groupId/members",
  controller.getAll
);
router.put(
  "/:groupId/members/:memberId",
  controller.rename
);
router.delete(
  "/:groupId/members/:memberId",
  controller.remove
);
module.exports = router;
