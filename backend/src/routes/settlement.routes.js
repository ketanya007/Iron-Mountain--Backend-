const router = require("express").Router();
const controller =
  require("../controllers/settlement.controller");
router.get(
  "/:groupId/balances",
  controller.getBalances
);
router.post(
  "/:groupId/settlements",
  controller.create
);
router.get(
  "/:groupId/settlements",
  controller.history
);
router.get(
  "/:groupId/settlements/suggestions",
  controller.suggestions
);
module.exports = router;
