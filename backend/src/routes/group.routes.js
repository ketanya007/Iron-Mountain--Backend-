const router = require("express").Router();
const controller =
  require("../controllers/group.controller");
router.post("/", controller.create);
router.get("/", controller.getAll);
router.get("/:groupId", controller.getOne);
router.put("/:groupId", controller.rename);
router.delete("/:groupId", controller.remove);
module.exports = router;
